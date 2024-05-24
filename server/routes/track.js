const router = require('express').Router();
const { LyricsAPI } =  require('../controllers/lyrics/lyricsApi.js');

router.get('/lyrics', async (req, res) => {
    const lyrics = await LyricsAPI.getLyrics(req, res);

    res.json(lyrics);
});

module.exports = router;
