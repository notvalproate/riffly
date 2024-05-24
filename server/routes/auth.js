const router = require('express').Router();
const { SpotifyAuth } = require('../controllers/spotify/spotifyAuth.js');

router.get('/login', async (req, res) => {
    res.send({ url: await SpotifyAuth.generateSpotifyAuthLink() });
});

router.get('/refresh', async (req, res) => {
    await SpotifyAuth.refreshCurrentTokens(req, res);

    res.send('Refreshed your tokens!');
});

router.get('/logout', (req, res) => {
    SpotifyAuth.deleteCookieTokens(res);

    res.send({ loggedOut: true });
});

router.get('/info', async (req, res) => {
    await SpotifyAuth.getAuthInfo(req, res);

    res.json({ authSuccessful: true });
});

router.get('/hasAuthToken', (req, res) => {
    res.json({ hasToken: SpotifyAuth.hasAuthToken(req) });
});

module.exports = router;
