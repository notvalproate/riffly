const musixMatchToken = process.env.MUSIX_MATCH_TOKEN;

class MusixmatchAPI {
    static musixmatchApiUrl = 'https://api.musixmatch.com/ws/1.1'

    static async getLyrics(isrc) {
        try {
            const song = await this.getTrack(isrc);

            if(song === null) {
                return null;
            }

            const lyrics = await this.getLyricsByID(song.track_id);

            if(lyrics === null) {
                return null;
            }

            return {
                provider: 'musixmatch',
                url: song.track_share_url,
                lyricsBody: lyrics.lyrics_body,
            };
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async getLyricsByID(id) {
        try {
            const params = new URLSearchParams({
                apikey: musixMatchToken,
                track_id: id,
            });

            const result = await fetch(this.musixmatchApiUrl + '/track.lyrics.get?' + params.toString(), {
                method: 'GET',
            });

            const json = await result.json();

            if(json.message.header.status_code === 404) {
                return null;
            }
            
            return json.message.body.lyrics;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async getTrack(isrc) {
        const params = new URLSearchParams({
            apikey: musixMatchToken,
            track_isrc: isrc,
        });

        const json = await musixMatchFetch('GET', `/track.get?${params.toString()}`);

        return json.message.body.track;
    }
};

async function musixMatchFetch(method, path) {
    const result = await fetch(MusixmatchAPI.musixmatchApiUrl + path + '121jk', {
        method: method,
    });

    const json = await result.json();

    if(!result.ok) {
        throw new ApiError(json.error.status, json.error.message);
    }

    return json;
}

module.exports = {
    MusixmatchAPI,
}