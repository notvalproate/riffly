import express from 'express';
import SpotifyAPI from '../controllers/spotify/spotifyApi.js';
import topRouter from './top.js';
import friendsRouter from './friends.js';

const router = express.Router();

router.use('/top', topRouter);
router.use('/friends', friendsRouter);

router.get('/info', SpotifyAPI.getUserInfo);
router.get('/player', SpotifyAPI.getPlayerInfo);

export default router;
