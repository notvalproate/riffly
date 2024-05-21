const router = require('express').Router();
const { SpotifyAPI } = require('../spotify/spotifyApi.js');

router.get('/getUserCharts', async (req, res) => {
    const userCharts = await SpotifyAPI.Get('/me/top/tracks', req, res);

    res.json(userCharts);
});

module.exports = router;
