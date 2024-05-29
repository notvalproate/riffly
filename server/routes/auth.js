const router = require('express').Router();
const { SpotifyAuth } = require('../controllers/spotify/spotifyAuth.js');

router.get('/login', SpotifyAuth.getSpotifyAuthLink);
router.post('/refresh', SpotifyAuth.refreshCurrentTokens);
router.delete('/logout', SpotifyAuth.deleteTokens);
router.post('/info', SpotifyAuth.getAuthInfo);
router.get('/token', SpotifyAuth.hasAuthToken);

module.exports = router;
