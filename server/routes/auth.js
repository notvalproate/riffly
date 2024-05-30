import express from 'express';
import SpotifyAuth from '../controllers/spotify/spotifyAuth.js';

const router = express.Router();

router.get('/login', SpotifyAuth.getSpotifyAuthLink);
router.post('/refresh', SpotifyAuth.refreshCurrentTokens);
router.delete('/logout', SpotifyAuth.deleteTokens);
router.post('/info', SpotifyAuth.getAuthInfo);
router.get('/token', SpotifyAuth.hasAuthToken);

export default router;
