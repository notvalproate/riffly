const musixMatchToken = process.env.MUSIX_MATCH_TOKEN;

class MusixmatchAPI {
    static musixmatchApiUrl = 'https://api.musixmatch.com/ws/1.1'

    static async getLyrics(artists, title) {
        try {
            const searches = await this.searchForSong(title);

            if(searches.length === 0){
                return null;
            }

            let bestSearch = this.getBestSearch(searches, artists, title);

            if(bestSearch === null) {
                return null;
            }

            if(bestSearch.has_lyrics !== 1) {
                return null;
            }

            const lyrics = await this.getLyricsByID(bestSearch.track_id);

            return {
                provider: 'musixmatch',
                url: bestSearch.track_share_url,
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
            
            return json.message.body.lyrics;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async searchForSong(title) {
        try {
            const params = new URLSearchParams({
                apikey: musixMatchToken,
                q_track: title,
                page_size: 10,
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

    static getBestSearch(searches, reqArtists, reqTitle) {
        let i = 1;

        const simplifiedReqTitle = simplifyText(reqTitle);

        for(let item of searches) {
            let hasArtists = false;
            
            for(let reqArtist of reqArtists) {
                if(compareText(simplifyText(item.track.artist_name), simplifyText(reqArtist))) {
                    hasArtists = true;
                    break;
                }
            }

            if(!hasArtists) {
                continue;
            }
            
            const simplifiedTitle = simplifyText(item.track.track_name);

            let titleIncludes = compareText(simplifiedTitle, simplifiedReqTitle);

            if(titleIncludes) {
                return item.track;
            }
        }

        for(let item of searches) {
            const simplifiedTitle = simplifyText(item.track.track_name);

            let isTitle = simplifiedTitle === simplifiedReqTitle;

            if(isTitle) {
                return item.track;
            }
        }

        return null;
    }
};

function compareText(textOne, textTwo) {
    return textOne.includes(textTwo) || textTwo.includes(textOne);
}

function simplifyText(text) {
    return text
        .toLowerCase()
        .replaceAll(' ', '')
        .replaceAll('’', "'")
        .replace(/[–—]/g, '-')
        .replaceAll('˃', '>')
        .replaceAll('˂', '<')
        .replaceAll('…', '...')
        .replaceAll(',', '')
        .normalize('NFC');
}

module.exports = {
    MusixmatchAPI,
}