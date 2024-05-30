const router = require('express').Router();
const SpotifyAPI = require('../controllers/spotify/spotifyApi.js');
const topRouter = require('./top.js');

router.use('/top', topRouter);

router.get('/info', SpotifyAPI.getUserInfo);
router.get('/player', SpotifyAPI.getPlayerInfo);

module.exports = router;
