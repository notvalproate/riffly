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
        const query = getTopItemsQuery(req);
        const first50 = spotifyFetch(
            'GET',
            `/me/top/tracks?${query.toString()}`,
            req
        );

        query.set('offset', 50);
        const next50 = spotifyFetch(
            'GET',
            `/me/top/tracks?${query.toString()}`,
            req
        );

        const top100tracks = [...((await first50).items), ...((await next50).items)];

        const allArtistIds = top100tracks.reduce((acc, track) => {
            track.artists.forEach(artist => acc.push(artist.id));
            return acc;
        }, []);

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
            (await batches[i]).artists.forEach(artist => artist.genres.forEach(genre => genreDict[genre] = (genreDict[genre] || 0) + 1));
        }

        const sortedDict = Object.fromEntries(
            Object.entries(genreDict).sort(([,a] , [,b]) => b - a).slice(0, 25)
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

async function spotifyFetch(method, path, req) {
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
