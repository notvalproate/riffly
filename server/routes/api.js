const router = require('express').Router();
const { SpotifyAPI } = require('../spotify/spotifyApi.js');
const { LyricsAPI } = require('../lyrics/lyricsApi.js');

const { SpotifyParser } = require('../spotify/spotifyParser.js');

router.get('/getUserInfo', async (req, res) => {
    let userInfo = await SpotifyAPI.Get('/me', req, res);

    if(res.statusCode === 200) {
        userInfo = SpotifyParser.parseUserInfo(userInfo);
    }
    
    res.json(userInfo);
});

router.get('/getPlayer', async (req, res) => {
    let playerInfo = await SpotifyAPI.Get('/me/player', req, res);

    if(res.statusCode === 200) {
        playerInfo = SpotifyParser.parsePlayerInfo(playerInfo);
    }

    res.json(playerInfo);
});

router.get('/getLyrics', async (req, res) => {
    const lyrics = await LyricsAPI.getLyrics(req, res);

    res.json(lyrics);
});

router.get('/getUserCharts', async (req, res) => {
    const userCharts = await SpotifyAPI.Get('/me/top/tracks', req, res);

    res.json(userCharts);
});

module.exports = router;
