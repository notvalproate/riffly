const asyncHandler = require('express-async-handler');
const { ApiError } = require('../../utils/api.error.js');

const musixMatchToken = process.env.MUSIX_MATCH_TOKEN;

class MusixmatchAPI {
    static musixmatchApiUrl = 'https://api.musixmatch.com/ws/1.1'

    static async getLyrics(isrc) {
        const song = await getTrackByISRC(isrc);

        if(!song) {
            return null;
        }

        const lyrics = await getLyricsBySongID(song.track_id);

        if(!lyrics) {
            return null;
        }

        return {
            provider: 'musixmatch',
            url: song.track_share_url,
            lyricsBody: lyrics.lyrics_body,
        };
    };
};

async function musixMatchFetch(method, path) {
    const result = await fetch(MusixmatchAPI.musixmatchApiUrl + path, {
        method: method,
    });

    if(!result.ok) {
        throw new ApiError(result.status, result.statusText);
    }

    const json = await result.json();

    return json;
}

async function getLyricsBySongID(id) {
    const params = new URLSearchParams({
        apikey: musixMatchToken,
        track_id: id,
    });

    const json = await musixMatchFetch('GET', `/track.lyrics.get?${params.toString()}`);
    const status = json.message.header.status_code;

    if(status !== 200) {
        return null;
    }
    
    return json.message.body.lyrics.lyrics_body;
}

async function getTrackByISRC(isrc) {
    const params = new URLSearchParams({
        apikey: musixMatchToken,
        track_isrc: isrc,
    });

    const json = await musixMatchFetch('GET', `/track.get?${params.toString()}`);
    const status = json.message.header.status_code;

    if(status !== 200) {
        return null;
    }

    return json.message.body.track;
}

module.exports = {
    MusixmatchAPI,
}