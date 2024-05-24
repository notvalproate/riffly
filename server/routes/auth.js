const router = require('express').Router();
const { SpotifyAuth } = require('../controllers/spotify/spotifyAuth.js');

router.get('/login', SpotifyAuth.getSpotifyAuthLink);
router.get('/refresh', SpotifyAuth.refreshCurrentTokens);
router.get('/logout', SpotifyAuth.deleteTokens);
router.get('/info', SpotifyAuth.getAuthInfo);
router.get('/hasAuthToken', SpotifyAuth.hasAuthToken);

module.exports = router;
