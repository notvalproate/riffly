const router = require('express').Router();
const { SpotifyAPI } = require('../spotify/spotifyApi.js');
const { GeniusAPI } = require('../lyrics/geniusApi.js');
const { MusixmatchAPI } = require('../lyrics/musixmatchApi.js');

const { SpotifyParser } = require('../spotify/spotifyParser.js');

router.get('/getUserInfo', async (req, res) => {
    let userInfo = await SpotifyAPI.Get('/me', req, res);

    if(res.statusCode === 200) {
        userInfo = SpotifyParser.parseUserInfo(userInfo);
    }
    
    res.json(userInfo);
});

router.get('/getPlayer', async (req, res) => {
    let playerInfo = await SpotifyAPI.Get('/me/player', req, res);

    if(res.statusCode === 200) {
        playerInfo = SpotifyParser.parsePlayerInfo(playerInfo);
    }

    res.json(playerInfo);
});

const redisClient = require('../database/cacher.js');

router.get('/getLyrics', async (req, res) => {
    const cachedLyric = await redisClient.get(req.query.isrc);

    if(cachedLyric !== null) {
        res.json(JSON.parse(cachedLyric));
    } else {
        const currentTrack = await SpotifyAPI.getSongByISRC(req.query.isrc, req, res);
    
        let lyrics = await GeniusAPI.getLyrics(currentTrack.artists, currentTrack.title);
    
        if(lyrics === null) {
            lyrics = await MusixmatchAPI.getLyrics(req.query.isrc);
        }

        await redisClient.set(req.query.isrc, JSON.stringify(lyrics));

        res.json(lyrics);
    }
});

router.get('/getUserCharts', async (req, res) => {
    const userCharts = await SpotifyAPI.Get('/me/top/tracks', req, res);

    res.json(userCharts);
});

module.exports = router;
