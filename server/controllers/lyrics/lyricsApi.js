import redisClient from '../../database/cacher.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../../utils/api.error.js';

import GeniusAPI from '../lyrics/geniusApi.js';
import MusixmatchAPI from '../lyrics/musixmatchApi.js';
import SpotifyAPI from '../spotify/spotifyApi.js';

export default class LyricsAPI {
    static getLyrics = asyncHandler(async (req, res) => {
        const isrc = req.query.isrc;

        if (isrc === undefined) {
            throw new ApiError(400, 'Missing ISRC Code');
        }

        const cachedLyrics = await redisClient.get(isrc);

        if (cachedLyrics !== null) {
            return res.status(200).json(JSON.parse(cachedLyrics));
        }

        const currentTrack = await SpotifyAPI.getSongByISRC(isrc, req);

        if (currentTrack === null) {
            throw new ApiError(404, 'Invalid ISRC Code or Track Not Found');
        }

        if (await getFromGenius(currentTrack, isrc, res)) {
            return;
        }

        await getFromMusixmatch(isrc, res);
    });
}

async function getFromGenius(currentTrack, isrc, res) {
    const gTrack = await GeniusAPI.getTrack(
        currentTrack.artists,
        currentTrack.title
    );

    if (gTrack !== null) {
        const gLyrics = await GeniusAPI.getLyricsFromTrack(gTrack);

        if (gLyrics !== null) {
            const json = {
                provider: 'genius',
                url: gTrack.url,
                isrc: isrc,
                lyricsBody: gLyrics,
            };

            res.status(200).json(json);
            await redisClient.set(isrc, JSON.stringify(json));

            return true;
        }

        await redisClient.set(isrc, JSON.stringify(null));
        throw new ApiError(404, 'This song does not have lyrics available.');
    }

    return false;
}

async function getFromMusixmatch(isrc, res) {
    const mTrack = await MusixmatchAPI.getTrackByISRC(isrc);

    if (mTrack === null) {
        await redisClient.set(isrc, JSON.stringify(null));
        throw new ApiError(
            404,
            'This song was not found in any of the lyrics providers.'
        );
    }

    const mLyrics = await MusixmatchAPI.getLyricsByTrackID(mTrack.track_id);

    if (mLyrics === null) {
        await redisClient.set(isrc, JSON.stringify(null));
        throw new ApiError(404, 'This song does not have lyrics available.');
    }

    const json = {
        provider: 'musixmatch',
        url: mTrack.track_share_url,
        isrc: isrc,
        lyricsBody: mLyrics,
    };

    res.status(200).json(json);
    await redisClient.set(isrc, JSON.stringify(json));
}

Object.freeze(LyricsAPI);
