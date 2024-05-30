import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import ApiError from '../../utils/api.error.js';
import env from '../../utils/environment.js';

const clientID = env.spotify.clientID;
const clientSecret = env.spotify.clientSecret;
const clientURL = env.app.client;
const domain = env.app.domain;

const redirectURI = clientURL + '/auth';

export default class SpotifyAuth {
    static hasAuthToken = asyncHandler((req, res) => {
        if (req.cookies.authToken) {
            res.status(200).json({ hasToken: true });
        } else {
            throw new ApiError(401, 'No auth token found, Please login again.');
        }
    });

    static getSpotifyAuthLink = asyncHandler(async (req, res) => {
        const state = generateRandomCode(128);
        const hashed = await generateCodeChallenge(state);
        const codeChallenge = base64Encode(hashed);

        const scope =
            'user-read-private user-read-email user-top-read user-read-playback-state';

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientID,
            scope: scope,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectURI,
        });

        const url =
            'https://accounts.spotify.com/authorize?' + params.toString();

        res.status(200).json({ url: url });
    });

    static getAuthInfo = asyncHandler(async (req, res) => {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: req.query.code,
            client_id: clientID,
            redirect_uri: redirectURI,
            code_verifier: req.query.state,
        });

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        if (!result.ok) {
            throw new ApiError(result.status, result.statusText);
        }

        const authInfo = await result.json();
        setCookieTokens(authInfo, res);

        res.status(204).send();
    });

    static refreshCurrentTokens = asyncHandler(async (req, res) => {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: req.cookies.refreshToken,
            client_id: clientID,
            client_secret: clientSecret,
        });

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        if (!result.ok) {
            throw new ApiError(result.status, result.statusText);
        }

        const newAuthInfo = await result.json();
        setCookieTokens(newAuthInfo, res);

        res.status(204).send();
    });

    static deleteTokens = asyncHandler((req, res) => {
        deleteCookieTokens(res);

        res.status(204).send();
    });
}

function deleteCookieTokens(res) {
    const cookieOptions = {
        httpOnly: true,
        domain: domain,
        path: '/',
    };

    res.clearCookie('authToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
}

function setCookieTokens(authInfo, res) {
    const cookieOptions = {
        httpOnly: true,
        domain: domain,
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    };

    res.cookie('authToken', authInfo.access_token, cookieOptions);
    res.cookie('refreshToken', authInfo.refresh_token, cookieOptions);
}

function generateRandomCode(length) {
    var text = '';
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

async function generateCodeChallenge(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);

    const hash = crypto.createHash('sha256');
    hash.update(data);
    const test = hash.digest('hex');
    const buffer = Buffer.from(test, 'hex');
    const challenge = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
    );

    return challenge;
}

function base64Encode(input) {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

Object.freeze(SpotifyAuth);
