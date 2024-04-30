const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const { SpotifyAuth } = require('./spotifyAuth.js');

const app = express();
const PORT = process.env.PORT || 4000;


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', SpotifyAuth.clientURL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});
app.use(cookieParser());


app.get('/login', (req, res) => {
    res.send({ url: SpotifyAuth.generateSpotifyAuthLink() });
});


app.get('/getAuthInfo', async (req, res) => {
    const authInfo = await SpotifyAuth.getAuthInfo(req.query.code, req.query.state);

    res.json({ authToken: authInfo.access_token, refreshToken: authInfo.refresh_token });
})


app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT + "/");
});
