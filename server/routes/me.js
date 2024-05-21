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

module.exports = router;
