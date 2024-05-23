const router = require('express').Router();
const { SpotifyAPI } = require('../spotify/spotifyApi.js');
const { SpotifyParser } = require('../spotify/spotifyParser.js');

router.get('/info', async (req, res) => {
    let userInfo = await SpotifyAPI.Get('/me', req, res);

    if(res.statusCode === 200) {
        userInfo = SpotifyParser.parseUserInfo(userInfo);
    }
    
    res.json(userInfo);
});

router.get('/player', async (req, res) => {
    let playerInfo = await SpotifyAPI.Get('/me/player?additional_types=episode', req, res);

    if(res.statusCode === 200) {
        playerInfo = SpotifyParser.parsePlayerInfo(playerInfo);
    }

    res.json(playerInfo);
});

const topRouter = require('./top.js');
router.use('/top', topRouter);

module.exports = router;
