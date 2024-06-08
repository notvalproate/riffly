import asyncHandler from 'express-async-handler';
import ApiError from '../../utils/api.error.js';
import SpotifyParser from '../../utils/spotify.parser.js';

export default class SpotifyAPI {
    static spotifyApiUri = 'https://api.spotify.com/v1';

    static getUserInfo = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        userInfo = SpotifyParser.parseUserInfo(userInfo);

        res.status(200).json(userInfo);
    });

    static getPlayerInfo = asyncHandler(async (req, res) => {
        let playerInfo = await spotifyFetch(
            'GET',
            '/me/player?additional_types=episode',
            req
        );

        if (playerInfo.no_content) {
            return res.status(204).send();
        }

        playerInfo = SpotifyParser.parsePlayerInfo(playerInfo);

        res.status(200).json(playerInfo);
    });

    static getTopTracks = asyncHandler(async (req, res) => {
        const query = getTopItemsQuery(req);
        const topTracks = await spotifyFetch(
            'GET',
            `/me/top/tracks?${query.toString()}`,
            req
        );

        res.status(200).json(topTracks);
    });

    static getTopArtists = asyncHandler(async (req, res) => {
        const query = getTopItemsQuery(req);
        const topArtists = await spotifyFetch(
            'GET',
            `/me/top/artists?${query.toString()}`,
            req
        );

        res.status(200).json(topArtists);
    });

    static getTopGenres = asyncHandler(async (req, res) => {
        const MAX_TRACKS_PER_REQUEST = 50;
        const requestCount = 3;
        const songCount = MAX_TRACKS_PER_REQUEST * requestCount;

        const query = getTopItemsQuery(req);
        const pendingTracks = [];

        for(let i = 0; i < requestCount; i++) {
            query.set('offset', i * MAX_TRACKS_PER_REQUEST);

            const tracks = spotifyFetch(
                'GET',
                `/me/top/tracks?${query.toString()}`,
                req
            );

            pendingTracks.push(tracks);
        }

        const topTracks = (await Promise.all(pendingTracks)).flatMap((tracks) => tracks.items);
        const allArtistIds = topTracks.map((track) => track.artists[0].id);
        const maxArtistsInBatch = 50;

        const fetch50ArtistsGenres = async (artistsIds) => {
            if(artistsIds.length > maxArtistsInBatch) {
                throw new ApiError(500, 'Too many artists');
            }

            const artistsQuery = new URLSearchParams({
                ids: artistsIds.join(','),
            });
    
            const artists = spotifyFetch(
                'GET',
                `/artists?${artistsQuery.toString()}`,
                req
            );

            return artists;
        }

        let batches = [];

        while(allArtistIds.length > 0) {
            const artistsBatch = allArtistIds.splice(0, maxArtistsInBatch);
            const batchResults = fetch50ArtistsGenres(artistsBatch);

            batches.push(batchResults);
        }

        let genreDict = {};

        for(let i = 0; i < batches.length; i++) {
            batches[i] = await batches[i];
            batches[i].artists.forEach(artist => artist.genres.forEach(genre => genreDict[genre] = (genreDict[genre] || 0) + 1));
        }

        const sortedDict = Object.fromEntries(
            Object.entries(genreDict).sort(([,a] , [,b]) => b - a).slice(0, 25).map(([key, value]) => [key, value / songCount])
        );

        res.status(200).json({ genres: sortedDict });
    });

    static async getSongByISRC(isrc, req) {
        const params = new URLSearchParams({
            type: 'track',
            q: `isrc:${isrc}`,
        });

        let searches = await spotifyFetch(
            'GET',
            `/search?${params.toString()}`,
            req
        );

        if (searches.tracks.items.length === 0) {
            return null;
        }

        const currentTrack = searches.tracks.items[0];
        const title = currentTrack.name;
        const artists = currentTrack.artists.map((artist) => artist.name);

        return {
            title: title,
            artists: artists,
        };
    }
}

export async function spotifyFetch(method, path, req) {
    const result = await fetch(SpotifyAPI.spotifyApiUri + path, {
        method: method,
        headers: { Authorization: `Bearer ${req.cookies.authToken}` },
    });

    if (result.status === 204) {
        return { no_content: true };
    }

    const json = await result.json();

    if (!result.ok) {
        throw new ApiError(json.error.status, json.error.message);
    }

    return json;
}

function getTopItemsQuery(req) {
    const termMap = {
        LONG: 'long_term',
        MEDIUM: 'medium_term',
        SHORT: 'short_term',
    };

    const term = req.query.term || 'MEDIUM';
    const offset = req.query.offset || 0;

    return new URLSearchParams({
        time_range: termMap[term] || termMap.MEDIUM,
        limit: 50,
        offset: offset,
    });
}

Object.freeze(SpotifyAPI);
