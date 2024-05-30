const router = require('express').Router();
const LyricsAPI =  require('../controllers/lyrics/lyricsApi.js');

router.get('/lyrics', LyricsAPI.getLyrics);

module.exports = router;
