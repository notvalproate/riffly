const router = require('express').Router();
const { SpotifyAPI } = require('../spotify/spotifyApi.js');

router.get('/getUserInfo', async (req, res) => {
    const userInfo = await SpotifyAPI.Get('/me', req, res);

    res.json(userInfo);
})

router.get('/getTrack', async (req, res) => {
    const playerInfo = await SpotifyAPI.Get('/me/player', req, res);

    res.json(playerInfo);
})

module.exports = router;