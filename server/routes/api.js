const router = require('express').Router();
const { SpotifyAPI } = require('../spotify/spotifyApi.js');
const { GeniusAPI } = require('../lyrics/geniusApi.js');
const { MusixmatchAPI } = require('../lyrics/musixmatchApi.js');

const { SpotifyParser } = require('../spotify/spotifyParser.js');

router.get('/getPlayer', async (req, res) => {
    let playerInfo = await SpotifyAPI.Get('/me/player', req, res);

    if(res.statusCode === 200) {
        playerInfo = SpotifyParser.parsePlayerInfo(playerInfo);
    }

    res.json(playerInfo);
});

router.get('/getLyrics', async (req, res) => {
    const currentTrack = await SpotifyAPI.getSongByISRC(req.query.isrc, req, res);

    let lyrics = await GeniusAPI.getLyrics(currentTrack.artists, currentTrack.title);

    if(lyrics === null) {
        lyrics = await MusixmatchAPI.getLyrics(req.query.isrc);
    }

    res.json(lyrics);
});

router.get('/getUserCharts', async (req, res) => {
    const userCharts = await SpotifyAPI.Get('/me/top/tracks', req, res);

    res.json(userCharts);
});

module.exports = router;
