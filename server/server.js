const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const { SpotifyAuth } = require('./spotify/spotifyAuth.js');
const { SpotifyAPI } = require('./spotify/spotifyApi.js');
const { populate } = require("dotenv");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}))
app.use(cookieParser());


app.get('/login', async (req, res) => {
    res.send({ url: await SpotifyAuth.generateSpotifyAuthLink() });
});

app.get('/refresh', async (req, res) => {
    await SpotifyAuth.refreshCurrentTokens(req, res);

    res.send("Refreshed your tokens!");
});

app.get('/logout', (req, res) => {
    SpotifyAuth.deleteCookieTokens(res);

    res.send({ loggedOut: true });
})

app.get('/hasAuthToken', (req, res) => {
    res.json({ hasToken: SpotifyAuth.hasAuthToken(req) });
});

app.get('/getAuthInfo', async (req, res) => {
    await SpotifyAuth.getAuthInfo(req, res);

    res.json({ authSuccessful: true });
});


app.get('/getUserInfo', async (req, res) => {
    const userInfo = await SpotifyAPI.Get('/me', req, res);

    res.json(userInfo);
})

app.get('/getTrack', async (req, res) => {
    const playerInfo = await SpotifyAPI.Get('/me/player', req, res);

    res.json(playerInfo);
})


app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT + "/");
});
