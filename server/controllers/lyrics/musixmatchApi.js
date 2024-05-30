const ApiError = require('../../utils/api.error.js');

const musixMatchToken = process.env.MUSIX_MATCH_TOKEN;

class MusixmatchAPI {
    static musixmatchApiUrl = 'https://api.musixmatch.com/ws/1.1'

    static async getTrackByISRC(isrc) {
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

    static async getLyricsByTrackID(id) {
        const params = new URLSearchParams({
            apikey: musixMatchToken,
            track_id: id,
        });
    
        const json = await musixMatchFetch('GET', `/track.lyrics.get?${params.toString()}`);
        const status = json.message.header.status_code;

        if(status !== 200) {
            return null;
        }

        const lyricsBody = json.message.body.lyrics.lyrics_body;

        if(lyricsBody === '') {
            return null;
        }  
        
        return lyricsBody;
    }
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

Object.freeze(MusixmatchAPI);

module.exports = MusixmatchAPI;
