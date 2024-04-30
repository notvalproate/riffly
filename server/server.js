const express = require("express");
const { SpotifyAuth } = require('./spotifyAuth.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', SpotifyAuth.clientURL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

app.get('/login', (req, res) => {
    res.send({ url: SpotifyAuth.generateSpotifyAuthLink() });
});

app.get('/callback', async (req, res) => {
    if(req.query.error) {
        res.redirect(SpotifyAuth.clientURL);
    } else {
        const authInfo = await SpotifyAuth.getAuthInfo(req.query.code, req.query.state);
        res.redirect(SpotifyAuth.clientURL + `/?authToken=${authInfo.access_token}`);
    }
})

app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT + "/");
});