const express = require("express");
const querystring = require("querystring");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectURI = 'http://localhost:4000/callback';

app.get('/login', (req, res) => {
    const state = generateRandomString(128);
    const scope = 'user-read-private user-read-email';

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientID,
        scope: scope,
        redirect_uri: redirectURI,
        state: state
    });

    res.send({ url: 'https://accounts.spotify.com/authorize?' + params.toString() });
});

app.get('/callback', async (req, res) => {
    if(req.query.error) {
        res.redirect('http://localhost:4200');
    } else {
        const accessToken = await getAccessToken(req.query.code, req.query.state);
        res.redirect(`http://localhost:4200/?authToken=${accessToken}`);
    }
})

app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT + "/");
});

function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    return text;
}

async function getAccessToken(code, verifier) {
    const params = new URLSearchParams({
        client_id: clientID,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: "http://localhost:4000/callback",
        code_verifier: verifier,
    });

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}