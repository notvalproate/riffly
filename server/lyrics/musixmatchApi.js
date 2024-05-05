const musixMatchToken = process.env.MUSIX_MATCH_TOKEN;

class MusixmatchAPI {
    static musixmatchApiUrl = 'https://api.musixmatch.com/ws/1.1'

    static async getLyrics(artists, title) {
        try {
            const searches = await this.searchForSong(artists, title);

            if(searches.length === 0){
                return null;
            }

            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async searchForSong(artists, title) {
        try {
            const hasMultipleArtists = Array.isArray(artists);

            if(!hasMultipleArtists) {
                artists = [artists];
            }

            const params = new URLSearchParams({
                apikey: musixMatchToken,
                q_track: title,
                q_artist: artists[0],
                page_size: 5,
                page: 1,
                s_track_rating: 'desc',
            });

            const result = await fetch(this.musixmatchApiUrl + '/track.search?' + params.toString(), {
                method: 'GET',
            });

            const json = await result.json();
            
            return json.message.body.track_list;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static async getBestSearch(searches, artist, title) {
        
    }
};

module.exports = {
    MusixmatchAPI,
}