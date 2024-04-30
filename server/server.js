const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

const { clientURL, apiURL, generateSpotifyAuthLink, getAuthInfo } = require('./spotifyAuth.js');

app.get('/login', (req, res) => {
    res.send({ url: generateSpotifyAuthLink() });
});

app.get('/callback', async (req, res) => {
    if(req.query.error) {
        res.redirect(clientURL);
    } else {
        const authInfo = await getAuthInfo(req.query.code, req.query.state);
        res.redirect(clientURL + `/?authToken=${authInfo.access_token}`);
    }
})

app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT + "/");
});