const router = require('express').Router();
const { SpotifyAPI } = require('../spotify/spotifyApi.js');
const { GeniusAPI } = require('../lyrics/geniusApi.js');

router.get('/getUserInfo', async (req, res) => {
    const userInfo = await SpotifyAPI.Get('/me', req, res);

    res.json(userInfo);
});

router.get('/getTrack', async (req, res) => {
    const playerInfo = await SpotifyAPI.Get('/me/player', req, res);

    res.json(playerInfo);
});

router.get('/getLyrics', async (req, res) => {
    let lyrics = await GeniusAPI.getLyrics(req.query.artists, req.query.title);

    if(lyrics !== null) {
        res.json(lyrics);
        return;
    }

    lyrics = null;

    res.json(lyrics);
});

module.exports = router;
