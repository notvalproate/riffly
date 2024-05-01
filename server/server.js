const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const { SpotifyAuth } = require('./spotifyAuth.js');

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}))
app.use(cookieParser());


app.get('/login', (req, res) => {
    res.send({ url: SpotifyAuth.generateSpotifyAuthLink() });
});


app.get('/hasAuthToken', (req, res) => {
    hasToken = false;

    if(req.cookies.authToken) {
        hasToken = true;
    }

    res.json({ hasToken: hasToken });
});


app.get('/getAuthInfo', async (req, res) => {
    const authInfo = await SpotifyAuth.getAuthInfo(req.query.code, req.query.state);

    const cookieOptions = {
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        expires: new Date(Date.now() + 60 * 60 * 24 * 7),
    };

    res.cookie('authToken', authInfo.access_token, cookieOptions);
    res.cookie('refreshToken', authInfo.refresh_token, cookieOptions);

    res.json({ authSuccessful: true });
});

app.get('/getUserInfo', async (req, res) => {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${req.cookies.authToken}` }
    });

    const userInfo = await result.json();

    res.json(userInfo);
})


app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT + "/");
});
