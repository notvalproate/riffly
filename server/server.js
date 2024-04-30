const express = require("express");
const mongoose = require("mongoose");
const querystring = require("querystring");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

const clientID = process.env.SPOTIFY_CLIENT_ID;
const redirectURI = 'http://localhost:4000/callback';

app.get('/login', function(req, res) {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';
  
    res.send({url:'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: clientID,
        scope: scope,
        redirect_uri: redirectURI,
        state: state
      })});
});

app.get('/callback', (req, res)=>{
    res.send({ response: "Logged in!" });
})

function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    return text;
}

app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT + "/");
});
