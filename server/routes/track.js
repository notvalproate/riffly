const router = require('express').Router();
const { SpotifyAPI } = require('../spotify/spotifyApi.js');
const { GeniusAPI } = require('../lyrics/geniusApi.js');
const { MusixmatchAPI } = require('../lyrics/musixmatchApi.js');

router.get('/lyrics', async (req, res) => {
    const currentTrack = await SpotifyAPI.getSongByISRC(req.query.isrc, req, res);

    let lyrics = await GeniusAPI.getLyrics(currentTrack.artists, currentTrack.title);

    if(lyrics === null) {
        lyrics = await MusixmatchAPI.getLyrics(req.query.isrc);
    }

    res.json(lyrics);
});

module.exports = router;
