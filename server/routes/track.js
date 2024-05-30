import express from 'express';
import LyricsAPI from '../controllers/lyrics/lyricsApi.js';

const router = express.Router();

router.get('/lyrics', LyricsAPI.getLyrics);

export default router;
