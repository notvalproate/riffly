const genius = require("genius-lyrics");

const geniusToken = process.env.GENIUS_CLIENT_TOKEN;

const DEBUG_LYRICS = false;

class GeniusAPI {
    static geniusClient = new genius.Client(geniusToken);

    static async getLyrics(artists, title) {
        for(let i = 0; i < artists.length; i++) {
            const result = await this.getBestLyrics([artists[i]], title);

            if(result !== null) {
                return result;
            }
        }

        if(artists.length === 1) {
            return null;
        }

        return await this.getBestLyrics(artists, title);
    }

    static async convertResultToLyrics(result) {
        try {
            return await result.lyrics();
        } catch(err) {
            console.log(err);
            return null;
        }
    }

    static async getBestLyrics(artists, title) {
        const jointArtists = artists.join(' ');
        const cleanTitle = cleanTitleForSearch(title);
        let queries = [
            `${cleanTitle} ${jointArtists}`, 
            `${jointArtists} ${cleanTitle}`
        ];

        for(let query of queries) {
            const result = await this.getBySearchQuery(query, artists, title);

            if(result !== null) {
                return {
                    provider: 'genius',
                    url: result.url,
                    lyricsBody: await this.convertResultToLyrics(result)
                };
            }
        }

        return null;
    }

    
    static async getBySearchQuery(searchQuery, artists, title) {
        debugLyrics(`\n\n\n################# SEARCHING FOR: ${searchQuery} #################`);

        const hits = await this.geniusClient.songs.search(searchQuery, {
            sanitizeQuery: false,
        });

        if(hits.length === 0) {
            debugLyrics("NO HITS");
            return null;
        }

        return this.getBestSearch(hits, artists, title);
    }

    static compareArtistNames(first, second) {
        const simpFirst = simplifyText(first);
        const simpSecond = simplifyText(second);

        const included = simpFirst.includes(simpSecond) || simpSecond.includes(simpFirst);

        if(included) {
            return true;
        }

        // Dirty checking, really desperate at this point to match artists, even skiley cant match.
        // EXPERIMENTAL, IF YOU DONT GET PROPER RESULTS FROM A SONG U THINK U SHUD GET, COMMENT THIS PART OUT AND TRY
        // THIS IS O(N^2) AND MAY GIVE BAD RESULTS, NOT YET FOUND SUCH A CASE THOUGH.

        const cleanedFirst = simplifyArtist(first).split(' ');
        const cleanedSecond = simplifyArtist(second).split(' ');

        const atLeastOnePartExists = cleanedFirst.some(part => cleanedSecond.includes(part));

        return atLeastOnePartExists;       
    }

    static getBestSearch(searches, reqArtists, reqTitle) {
        // FIRST PASS, EQUALS
        debugLyrics("########################################### FIRST PASS ###########################################");
        
        let i = 1;

        const simplifiedReqTitle = simplifyText(reqTitle);

        for(let item of searches) {
            item.hasArtists = false;
            
            debugLyrics(`\n${i++}>\n`);
            
            for(let reqArtist of reqArtists) {
                debugLyrics(`Required Artist:${reqArtist}||Current:${item.artist.name}|`);

                if(this.compareArtistNames(item.artist.name, reqArtist)) {
                    debugLyrics("ABOVE HAS ARTIST");
                    item.hasArtists = true;
                    break;
                }
            }

            if(!item.hasArtists) {
                continue;
            }

            debugLyrics("ABOVE DOESNT HAVE ARTIST");
            
            const simplifiedTitle = simplifyText(item.title);

            let titleMatches = ( simplifiedTitle == simplifiedReqTitle );

            debugLyrics(`Required Title:${simplifiedReqTitle}||Current:${simplifiedTitle}|`);

            if(titleMatches) {
                debugLyrics('ABOVE IS TITLE');
                return item;
            }
            debugLyrics('ABOVE IS NOT TITLE');
        }

        i = 1;

        // SECOND PASS, INCLUDES
        debugLyrics("########################################### SECOND PASS ###########################################");

        for(let item of searches) {
            if(!item.hasArtists) {
                continue;
            }

            let simplifiedTitle = simplifyText(item.title);

            let includesTitle = simplifiedTitle.includes(simplifiedReqTitle) || simplifiedReqTitle.includes(simplifiedTitle);

            debugLyrics(`\n\n${i++}>\nRequired Title: ${simplifiedReqTitle} || Current: ${simplifiedTitle}`);

            if(includesTitle) {
                debugLyrics('ABOVE HAS TITLE');
                return item;
            }
        }

        debugLyrics("########################################### THIRD PASS ###########################################");

        for(let item of searches) {
            if(!item.hasArtists) {
                continue;
            }

            let simplifiedTitle = simplifyText(item.title);
            let cleanedReqTitle = simplifyText(cleanTitleForSearch(reqTitle));

            let includesTitle = simplifiedTitle.includes(cleanedReqTitle) || cleanedReqTitle.includes(simplifiedTitle);

            debugLyrics(`\n\n${i++}>\nRequired Title: ${cleanedReqTitle} || Current: ${simplifiedTitle}`);

            if(includesTitle) {
                debugLyrics('ABOVE HAS TITLE');
                return item;
            }
        }

        // THIRD PASS, CHECK FOR TITLE TO BE EXACTLY SAME
        debugLyrics("########################################### FOURTH PASS ###########################################");

        for(let item of searches) {
            let includesTitle = simplifyText(item.title) === simplifiedReqTitle;

            debugLyrics(`Required Title: ${simplifiedReqTitle} || Current: ${simplifyText(item.title)}`);

            if(!includesTitle) {
                continue;
            }

            debugLyrics('ABOVE HAS SAME TITLE');
            return item;
        }

        // FOURTH PASS ALLOW GENIUS AS ARTIST
        debugLyrics("########################################### FIFTH PASS ###########################################");

        for(let item of searches) {
            let includesTitle = simplifyText(item.title).includes(simplifiedReqTitle) || simplifyText(simplifiedReqTitle).includes(item.title);

            if(!includesTitle) {
                continue;
            }

            let includesGenius = simplifyText(item.artist.name).includes('genius');
            debugLyrics(`Required Artist: ${'Genius'} || Current: ${item.artist.name}`);

            if(includesGenius) {
                debugLyrics('ABOVE HAS GENIUS');
                return item;
            }
        }

        debugLyrics("################# NO RESULT #################");

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

    const ftIndex = title.toLowerCase().indexOf('(ft');
    
    if (featIndex !== -1) {
        title = title.slice(0, ftIndex);
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
        .replaceAll(',', '')
        .normalize('NFC');
}

function simplifyArtist(artist) {
    return artist
        .toLowerCase()
        .replace(/[\[\]()–—\-'’˃>˂<…]/g, ' ')
        .replaceAll('.', '')
        .normalize('NFC');
}

function debugLyrics(text) {
    if(!DEBUG_LYRICS) return;

    console.log(text);
}

module.exports = { 
    GeniusAPI, 
};
