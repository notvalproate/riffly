const asyncHandler = require('express-async-handler');
const { ApiError } = require('../../utils/api.error.js');
const { SpotifyParser } = require('../../utils/spotify.parser.js');

class SpotifyAPI {
    static spotifyApiUri = 'https://api.spotify.com/v1';

    static getUserInfo = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        userInfo = SpotifyParser.parseUserInfo(userInfo);

        res.status(200).json(userInfo);
    })

    static getPlayerInfo = asyncHandler(async (req, res) => {
        let playerInfo = await spotifyFetch('GET', '/me/player?additional_types=episode', req);

        if(playerInfo.no_content) {
            return res.status(204).send();
        }
        
        playerInfo = SpotifyParser.parsePlayerInfo(playerInfo);

        res.status(200).json(playerInfo);
    })

    static async getSongByISRC(isrc, req) {
        const params = new URLSearchParams({
            type: 'track',
            q: `isrc:${isrc}`,
        });
    
        let searches = await spotifyFetch('GET', `/search?${params.toString()}`, req);

        if(searches.tracks.items.length === 0) {
            throw new ApiError(404, 'Invalid ISRC or Track not found');
        }

        const currentTrack = searches.tracks.items[0];
        const artists = currentTrack.artists.map((artist) => artist.name);
        const title = currentTrack.name;

        return {
            artists: artists,
            title: title
        }
    }
}

async function spotifyFetch(method, path, req) {
    const result = await fetch(SpotifyAPI.spotifyApiUri + path, {
        method: method,
        headers: { Authorization: `Bearer ${req.cookies.authToken}` },
    });
    
    if(result.status === 204) {
        return { no_content: true };
    }

    const json = await result.json();

    if(!result.ok) {
        throw new ApiError(json.error.status, json.error.message);
    }

    return json;
}

Object.freeze(SpotifyAPI);

module.exports = {
    SpotifyAPI,
};
