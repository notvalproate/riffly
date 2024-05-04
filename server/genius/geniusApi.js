const genius = require("genius-lyrics");

const geniusToken = process.env.GENIUS_CLIENT_TOKEN;

class GeniusAPI {
    static geniusClient = new genius.Client(geniusToken);

    static async getLyrics(artists, title) {
        try {
            title = cleanTitleForSearch(title);
            console.log("CLEANED TITLE TO: " + title);

            // FIRST SEARCH WITH FULL ARTISTS
            let searches = await this.geniusClient.songs.search(`${artists.map(artist => artist.name).join(' ')} ${title}`, {
                sanitizeQuery: false,
            });

            console.log(`${artists.map(artist => artist.name).join(' ')} ${title}`);

            let allArtist = true;

            if(searches.length === 0) {
                console.log("No All Artist Hits");
                allArtist = false;
                searches = await this.geniusClient.songs.search(`${artists[0].name} ${title}`, {
                    sanitizeQuery: false,
                });
            }

            if(searches.length === 0) {
                console.log("No Main Artist Hits");
                return null;
            }

            console.log("Got searches");
    
            let topSearch = this.getAccurateResult(searches, artists, title);
            
            if(topSearch === null) {
                console.log("First Result was null!");

                if(allArtist) {
                    console.log("Find next result");
                    searches = await this.geniusClient.songs.search(`${artists[0].name} ${title}`);
                    topSearch = this.getAccurateResult(searches, artists, title);
                } else {
                    return null;
                }
            }

            if(topSearch === null) {
                console.log("All Results was null!");

                return null;
            }

            console.log("Got accurate result");
    
            try {
                const lyrics = await topSearch.lyrics();
                console.log("Got lyrics");
                return lyrics;
            } catch (err) {
                console.log('No Lyrics');
                return null;
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static getAccurateResult(searches, reqArtists, reqTitle) {
        // FIRST PASS, EQUALS
        console.log("########################################### FIRST PASS ###########################################");

        let i = 1;

        for(let item of searches) {
            item.hasArtists = false;
            
            console.log(`\n\n${i++}>\n`);
            
            for(let reqArtist of reqArtists) {  
                console.log(`Required Artist: ${reqArtist.name} || Current: ${item.artist.name}`);
                if(simplifyText(item.artist.name).includes(simplifyText(reqArtist.name))) {
                    console.log("ABOVE HAS ARTIST");
                    item.hasArtists = true;
                    break;
                }
            }

            if(!item.hasArtists) {
                continue;
            }
            
            let titleMatches = ( simplifyText(item.title) == simplifyText(reqTitle) );

            console.log(`Required Title: ${simplifyText(item.title)} || Current: ${simplifyText(reqTitle)}`);

            if(titleMatches) {
                console.log('ABOVE IS TITLE');
                return item;
            }
        }

        i = 1;

        // SECOND PASS, INCLUDES
        console.log("########################################### SECOND PASS ###########################################");

        for(let item of searches) {
            if(!item.hasArtists) {
                continue;
            }

            let includesTitle = simplifyText(item.title).includes(simplifyText(reqTitle));

            console.log(`\n\n${i++}>\n`);
            console.log(`Required Title: ${reqTitle} || Current: ${item.title}`);

            if(includesTitle) {
                console.log('ABOVE HAS TITLE');
                return item;
            }
        }

        // THIRD PASS, ALLOW GENIUS AS ARTIST
        console.log("########################################### THIRD PASS ###########################################");

        for(let item of searches) {
            let includesTitle = simplifyText(item.title).includes(simplifyText(reqTitle));

            if(!includesTitle) {
                continue;
            }

            let includesGenius = simplifyText(item.artist.name).includes('genius');
            console.log(`Required Artist: ${'Genius'} || Current: ${item.artist.name}`);

            if(includesGenius) {
                console.log('ABOVE HAS GENIUS');
                return item;
            }
        }

        console.log("################# NO RESULT #################");

        return null;

        // TEST REMIXES AND TEST LONG ONES LIKE (FROM THE SPIDERMAN MOVIE ETC)
    }
};

function cleanTitleForSearch(title) {
    const featIndex = title.indexOf('(feat');
    
    if (featIndex !== -1) {
        title = title.slice(0, featIndex);
    }

    title.replace(/[–—]/g, '-');

    const hyphenIndex = title.indexOf(' - ');

    if (hyphenIndex !== -1) {
        title = title.slice(0, hyphenIndex);
    }

    return title;
}

function simplifyText(text) {
    return text
        .toLowerCase()
        .replaceAll(' ', '')
        .replaceAll('’', "'")
        .replace(/[–—]/g, '-');
}

module.exports = { 
    GeniusAPI, 
};
