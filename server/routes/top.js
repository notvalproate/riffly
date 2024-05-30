import express from 'express';
import SpotifyAPI from '../controllers/spotify/spotifyApi.js';

const router = express.Router();

router.get('/tracks', SpotifyAPI.getTopTracks);
router.get('/artists', SpotifyAPI.getTopArtists);
// router.get('/genres', SpotifyAPI.getTopGenres);

export default router;
