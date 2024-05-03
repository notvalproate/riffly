const genius = require("genius-lyrics");

const geniusToken = process.env.GENIUS_CLIENT_TOKEN;

class GeniusAPI {
    static geniusClient = new genius.Client(geniusToken);

    static async getLyrics(artist, song) {
        const searches = await this.geniusClient.songs.search(`${artist} ${song}`);
        const topSearch = searches[0];

        if(song !== topSearch.title) {
            return null;
        }

        try {
            const lyrics = await topSearch.lyrics();
            return lyrics;
        } catch (err) {
            return null;
        }
    }
};

module.exports = { 
    GeniusAPI, 
};
