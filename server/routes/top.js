const router = require('express').Router();
const SpotifyAPI = require('../controllers/spotify/spotifyApi.js');

router.get('/tracks', SpotifyAPI.getTopTracks);
router.get('/artists', SpotifyAPI.getTopArtists);
// router.get('/genres', SpotifyAPI.getTopGenres);

module.exports = router;
