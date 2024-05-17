const router = require('express').Router();
const { SpotifyAPI } = require('../spotify/spotifyApi.js');
const { GeniusAPI } = require('../lyrics/geniusApi.js');
const { MusixmatchAPI } = require('../lyrics/musixmatchApi.js');

router.get('/getUserInfo', async (req, res) => {
    const userInfo = await SpotifyAPI.Get('/me', req, res);

    res.json(userInfo);
});

router.get('/getTrack', async (req, res) => {
    const playerInfo = await SpotifyAPI.Get('/me/player', req, res);

    res.json(playerInfo);
});

router.get('/getLyrics', async (req, res) => {
    const params = new URLSearchParams({
        type: 'track',
        q: `isrc:${req.query.isrc}`,
    })

    let currentTrack = await SpotifyAPI.Get(`/search?${params.toString()}`, req, res);
    currentTrack = currentTrack.tracks.items[0];

    const artists = currentTrack.artists.map((artist) => artist.name);
    const title = currentTrack.name;

    let lyrics = await GeniusAPI.getLyrics(artists, title);

    if(lyrics === null) {
        lyrics = await MusixmatchAPI.getLyrics(artists, title);
    }

    res.json(lyrics);
});

router.get('/getUserCharts', async (req, res) => {
    const userCharts = await SpotifyAPI.Get('/me/top/tracks', req, res);

    res.json(userCharts);
});

module.exports = router;
