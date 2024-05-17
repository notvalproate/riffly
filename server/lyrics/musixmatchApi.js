const musixMatchToken = process.env.MUSIX_MATCH_TOKEN;

const DEBUG_LYRICS = false;

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
                lyrics: lyrics.lyrics_body,
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
        try {
            const params = new URLSearchParams({
                apikey: musixMatchToken,
                track_isrc: isrc,
            });

            const result = await fetch(this.musixmatchApiUrl + '/track.get?' + params.toString(), {
                method: 'GET',
            });

            const json = await result.json();

            return json.message.body.track;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

};

module.exports = {
    MusixmatchAPI,
}