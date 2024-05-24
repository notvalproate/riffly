const redisClient = require('../database/cacher.js');
const { GeniusAPI } = require('../lyrics/geniusApi.js');
const { MusixmatchAPI } = require('../lyrics/musixmatchApi.js');
const { SpotifyAPI } = require('../controllers/spotify/spotifyApi.js');

class LyricsAPI {
    static async getLyrics(req, res) {
        const cachedLyrics = await redisClient.get(req.query.isrc);

        if(cachedLyrics !== null) {
            return JSON.parse(cachedLyrics);
        } else {
            const currentTrack = await SpotifyAPI.getSongByISRC(req.query.isrc, req, res);
        
            let lyrics = await GeniusAPI.getLyrics(currentTrack.artists, currentTrack.title);
        
            if(lyrics === null) {
                lyrics = await MusixmatchAPI.getLyrics(req.query.isrc);
            }

            await redisClient.set(req.query.isrc, JSON.stringify(lyrics));

            return lyrics;
        }
    }
}

module.exports = {
    LyricsAPI,
}