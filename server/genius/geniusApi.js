const genius = require("genius-lyrics");

const geniusToken = process.env.GENIUS_CLIENT_TOKEN;

class GeniusAPI {
    static geniusClient = new genius.Client(geniusToken);

    static async getLyrics(artists, title) {
        try {
            title = cleanTitleForSearch(title);

            const hasMultipleArtists = Array.isArray(artists);

            if(!hasMultipleArtists) {
                return await this.getBestLyrics([artists], title);
            }

            const resultOne = await this.getBestLyrics([artists[0]], title);

            if(resultOne === null) {
                return await this.getBestLyrics(artists, title);
            }

            return resultOne;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async getBestLyrics(artists, title) {
        const jointArists = artists.join(' ');
        let searchQueryOne = `${title} ${jointArists}`;
        let searchQueryTwo = `${jointArists} ${title}`;

        const firstResult = await this.getBySearchQuery(searchQueryOne, artists, title);

        if(firstResult !== null) {
            return await firstResult.lyrics();
        }

        const secondResult = await this.getBySearchQuery(searchQueryTwo, artists, title);

        if(secondResult !== null) {
            return await secondResult.lyrics();
        }

        return null;
    }

    
    static async getBySearchQuery(searchQuery, artists, title) {
        console.log(`\n\n\n`);
        console.log(`################# SEARCHING FOR: ${searchQuery} #################`);

        const hits = await this.geniusClient.songs.search(searchQuery, {
            sanitizeQuery: false,
        });

        if(hits.length === 0) {
            console.log("NO HITS");
            return null;
        }

        return this.getBestSearch(hits, artists, title);
    }

    static getBestSearch(searches, reqArtists, reqTitle) {
        // FIRST PASS, EQUALS
        console.log("########################################### FIRST PASS ###########################################");
        
        let i = 1;

        const simplifiedReqTitle = simplifyText(reqTitle);

        for(let item of searches) {
            item.hasArtists = false;
            
            console.log(`\n\n${i++}>\n`);
            
            for(let reqArtist of reqArtists) {  
                console.log(`Required Artist: ${reqArtist} || Current: ${item.artist.name}`);
                if(simplifyText(item.artist.name).includes(simplifyText(reqArtist))) {
                    console.log("ABOVE HAS ARTIST");
                    item.hasArtists = true;
                    break;
                }
            }

            if(!item.hasArtists) {
                continue;
            }
            
            const simplifiedTitle = simplifyText(item.title);

            let titleMatches = ( simplifiedTitle == simplifiedReqTitle );

            console.log(`Required Title: ${simplifiedReqTitle} || Current: ${simplifiedTitle}`);

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

            let simplifiedTitle = simplifyText(item.title);

            let includesTitle = simplifiedTitle.includes(simplifyText(simplifiedReqTitle)) || simplifiedReqTitle.includes(simplifiedTitle);

            console.log(`\n\n${i++}>\n`);
            console.log(`Required Title: ${simplifiedReqTitle} || Current: ${simplifiedTitle}`);

            if(includesTitle) {
                console.log('ABOVE HAS TITLE');
                return item;
            }
        }

        // THIRD PASS, CHECK FOR TITLE TO BE EXACTLY SAME
        console.log("########################################### THIRD PASS ###########################################");

        for(let item of searches) {
            let includesTitle = simplifyText(item.title) === simplifiedReqTitle;

            if(!includesTitle) {
                continue;
            }

            console.log('ABOVE HAS SAME TITLE');
            return item;
        }

        // FOURTH PASS ALLOW GENIUS AS ARTIST
        console.log("########################################### FOURTH PASS ###########################################");

        for(let item of searches) {
            let includesTitle = simplifyText(item.title).includes(simplifiedReqTitle);

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

    }
};

function cleanTitleForSearch(title) {
    title.replace(/[–—]/g, '-');

    const hyphenIndex = title.indexOf(' - ');

    if (hyphenIndex !== -1) {
        title = title.slice(0, hyphenIndex);
    }

    const featIndex = title.toLowerCase().indexOf('(feat');
    
    if (featIndex !== -1) {
        title = title.slice(0, featIndex);
    }

    const fromIndex = title.toLowerCase().indexOf('(from');
    
    if (fromIndex !== -1) {
        title = title.slice(0, fromIndex);
    }

    const parenthesisIndex = title.toLowerCase().indexOf('(');
    const endingIndex = title.toLowerCase().indexOf(')');

    if(parenthesisIndex > 0 && endingIndex === title.length - 1) {
        title = title.slice(0, parenthesisIndex);
    }

    return title;
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
        .normalize('NFC');
}

module.exports = { 
    GeniusAPI, 
};
