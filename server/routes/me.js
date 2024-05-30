import express from 'express';
import SpotifyAPI from '../controllers/spotify/spotifyApi.js';
import topRouter from './top.js';

const router = express.Router();

router.use('/top', topRouter);

router.get('/info', SpotifyAPI.getUserInfo);
router.get('/player', SpotifyAPI.getPlayerInfo);

export default router;
