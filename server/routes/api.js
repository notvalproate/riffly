const router = require('express').Router();
const { SpotifyAPI } = require('../spotify/spotifyApi.js');
const { GeniusAPI } = require('../genius/geniusApi.js');

router.get('/getUserInfo', async (req, res) => {
    const userInfo = await SpotifyAPI.Get('/me', req, res);

    res.json(userInfo);
});

router.get('/getTrack', async (req, res) => {
    const playerInfo = await SpotifyAPI.Get('/me/player', req, res);

    if(playerInfo.item) {   
        if(playerInfo.item.name !== req.query.current_song) {
            let lyrics = await GeniusAPI.getLyrics(playerInfo.item.artists.map((artist) => artist.name).join(', '), playerInfo.item.name);
            playerInfo.update_lyrics = true;
            playerInfo.lyrics = lyrics;
        }
    }

    res.json(playerInfo);
});

module.exports = router;
