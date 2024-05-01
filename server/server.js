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


app.get('/getAuthInfo', async (req, res) => {
    const authInfo = await SpotifyAuth.getAuthInfo(req.query.code, req.query.state);

    res.cookie('authToken', authInfo.access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600),
    });
    res.cookie('refreshToken', authInfo.refresh_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600),
    });

    console.log("Came to set cookie:\n", res.getHeaders());

    res.json({ authSuccessful: true });
})


app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT + "/");
});
