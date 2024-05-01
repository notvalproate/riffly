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

    static async generateSpotifyAuthLink() {
        const state = generateRandomCode(128);
        const hashed = await generateCodeChallenge(state);
        const codeChallenge = base64Encode(hashed);

        const scope = 'user-read-private user-read-email user-top-read user-read-playback-state';
    
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientID,
            scope: scope,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectURI,
        });
    
        return 'https://accounts.spotify.com/authorize?' + params.toString();
    }

    static async getAuthInfo(code, verifier) {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: clientID,
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

    static async refreshAuthInfo(req, res) {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: req.cookies.refreshToken,
            client_id: clientID,
            client_secret: clientSecret,
        });

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        const newAuthInfo = await result.json();

        const cookieOptions = {
            httpOnly: true,
            domain: 'localhost',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        };
        
        console.log(newAuthInfo);

        res.cookie('authToken', newAuthInfo.access_token, cookieOptions);
        res.cookie('refreshToken', newAuthInfo.refresh_token, cookieOptions);
    }
};

function generateRandomCode(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    return text;
}

const { subtle } = globalThis.crypto;

async function generateCodeChallenge(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return subtle.digest('SHA-256', data);
}

function base64Encode(input) {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
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
