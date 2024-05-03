const genius = require("genius-lyrics");

const geniusToken = process.env.GENIUS_CLIENT_TOKEN;

class GeniusAPI {
    static geniusClient = new genius.Client(geniusToken);

    static async getLyrics(artists, title) {
        try {
            const searches = await this.geniusClient.songs.search(`${artists.map((artist) => artist.name).join(' ')} ${title}`);

            if(searches.length === 0) {
                return null;
            }
    
            const topSearch = this.getAccurateResult(searches, artists, title);
            
            if(topSearch === null) {
                return null;
            }
    
            try {
                const lyrics = await topSearch.lyrics();
                return lyrics;
            } catch (err) {
                console.log(err);
                return null;
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static getAccurateResult(searches, reqArtists, reqTitle) {
        for(let item of searches) {
            let hasTitle = simplifyText(item.title).includes(simplifyText(reqTitle));
            let hasArtists = false;

            for(let reqArtist of reqArtists) {
                if(simplifyText(item.artist.name).includes(simplifyText(reqArtist.name))) {
                    hasArtists = true;
                    break;
                }
            }

            if(hasTitle && hasArtists) {
                return item;
            }
        }

        return null;
    }
};

function simplifyText(text) {
    return text.toLowerCase().replaceAll(' ', '');
}

module.exports = { 
    GeniusAPI, 
};
