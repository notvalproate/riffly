const fetch = require('cross-fetch');

const { URLSearchParams } = require('url');
require("dotenv").config();

const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const clientURL = 'http://localhost:4200';
const apiPORT = process.env.PORT || 4000;
const apiURL = 'http://localhost:' + apiPORT;
const redirectURI = clientURL + '/login';

class SpotifyAuth {
    static get clientURL() { return clientURL; }
    static get apiURL() { return apiURL; }

    static hasAuthToken(req) {
        if(req.cookies.authToken) {
            return true;
        }
        return false;
    }

    static generateSpotifyAuthLink() {
        const state = generateRandomString(128);
        const scope = 'user-read-private user-read-email user-top-read user-read-playback-state';
    
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientID,
            scope: scope,
            redirect_uri: redirectURI,
            state: state
        });
    
        return 'https://accounts.spotify.com/authorize?' + params.toString();
    }

    static async getAuthInfo(code, verifier) {
        const params = new URLSearchParams({
            client_id: clientID,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectURI,
            code_verifier: verifier,
        });

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        return await result.json();
    }

    static async refreshCurrentTokens(refreshToken) {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientID,
            client_secret: clientSecret
        });

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        return await result.json();
    }
};

function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    return text;
}

async function authenticate(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    let tokenExpiration = req.cookies.tokenExpiration;

    const { accessToken: newAccessToken, refreshToken: newRefreshToken, tokenExpiration: newTokenExpiration } = await refreshOrGetAccessToken(refreshToken, accessToken, tokenExpiration);

    if (newAccessToken !== accessToken || newRefreshToken !== refreshToken || newTokenExpiration !== tokenExpiration) {
        res.cookie('accessToken', newAccessToken, { maxAge: newTokenExpiration - Date.now() / 1000 });
        res.cookie('refreshToken', newRefreshToken);
        res.cookie('tokenExpiration', newTokenExpiration);
    }

    req.accessToken = newAccessToken;
    req.refreshToken = newRefreshToken;
    req.tokenExpiration = newTokenExpiration;

    next();
}

function isTokenExpired(tokenExpiration) {
    return tokenExpiration < Date.now() / 1000;
}

async function refreshOrGetAccessToken(refreshToken, accessToken, tokenExpiration) {
    if (!accessToken || isTokenExpired(tokenExpiration)) {
        const { access_token, expires_in, refresh_token } = await SpotifyAuth.refreshCurrentTokens(refreshToken);
        const newTokenExpiration = Date.now() / 1000 + expires_in;
        return { accessToken: access_token, refreshToken: refresh_token, tokenExpiration: newTokenExpiration };
    } else {
        return { accessToken, refreshToken, tokenExpiration };
    }
}

async function getUserData(req, res) {
    try {
        const { accessToken, refreshToken, tokenExpiration } = req;

        res.status(200).json({ message: "API call successful" });
    } catch (error) {
        console.error("Error making API call:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    SpotifyAuth
};
