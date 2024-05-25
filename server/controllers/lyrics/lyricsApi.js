const redisClient = require('../../database/cacher.js');
const asyncHandler = require('express-async-handler');
const { ApiError } = require('../../utils/api.error.js');

const { GeniusAPI } = require('../lyrics/geniusApi.js');
const { MusixmatchAPI } = require('../lyrics/musixmatchApi.js');
const { SpotifyAPI } = require('../spotify/spotifyApi.js');

class LyricsAPI {
    static getLyrics = asyncHandler(async (req, res) => {
        const isrc = req.query.isrc;

        if(isrc === undefined) {
            throw new ApiError(400, 'Missing ISRC Code');
        }

        const cachedLyrics = await redisClient.get(isrc);

        if(cachedLyrics !== null) {
            return res.status(200).json(JSON.parse(cachedLyrics));
        }

        // const currentTrack = await SpotifyAPI.getSongByISRC(isrc, req);
    
        // let lyrics = await GeniusAPI.getLyrics(currentTrack.artists, currentTrack.title);
    
        // if(lyrics === null) {
            let lyrics = await MusixmatchAPI.getLyrics(isrc);
        // }

        res.status(200).json(lyrics);

        await redisClient.set(isrc, JSON.stringify(lyrics));
    });
}

Object.freeze(LyricsAPI);

module.exports = {
    LyricsAPI,
}
