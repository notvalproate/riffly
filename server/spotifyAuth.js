require("dotenv").config();

const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const clientURL = 'http://localhost:4200'

const apiPORT = process.env.PORT || 4000;
const apiURL = 'http://localhost:' + apiPORT;

const redirectURI = apiURL + '/callback';

class SpotifyAuth {
    static get clientURL() { return clientURL; }
    static get apiURL() { return apiURL; }

    static generateSpotifyAuthLink() {
        const state = generateRandomString(128);
        const scope = 'user-read-private user-read-email';
    
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
            redirect_uri: apiURL + '/callback',
            code_verifier: verifier,
        });

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        return await result.json();
    }
};

// UTILITY

function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    return text;
}

module.exports = {
    SpotifyAuth
};