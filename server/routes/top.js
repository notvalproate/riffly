const router = require('express').Router();
const { SpotifyAPI } = require('../controllers/spotify/spotifyApi.js');

function getSearchParams(req) {
    const termMap = {
        LONG: 'long_term',
        MEDIUM: 'medium_term',
        SHORT: 'short_term',
    };

    const term = req.query.term ?? 'MEDIUM';
    const offset = req.query.offset ?? 0;

    return new URLSearchParams({
        time_range: termMap[term] ?? termMap.MEDIUM,
        limit: 50,
        offset: offset,
    });
}

router.get('/tracks', async (req, res) => {
    const params = getSearchParams(req);

    const topTracks = await SpotifyAPI.Get(`/me/top/tracks?${params.toString()}`, req, res);

    res.json(topTracks);
});

router.get('/artists', async (req, res) => {
    const params = getSearchParams(req);

    const topArtists = await SpotifyAPI.Get(`/me/top/artists?${params.toString()}`, req, res);

    res.json(topArtists);
});

router.get('/genres', async (req, res) => {
    const params = getSearchParams(req);

    const topArtists = await SpotifyAPI.Get(`/me/top/genres?${params.toString()}`, req, res);

    res.json(topArtists);
});

module.exports = router;
