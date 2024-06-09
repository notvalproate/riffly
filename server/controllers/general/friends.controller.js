import asyncHandler from 'express-async-handler';

import ApiError from '../../utils/api.error.js';

import SpotifyParser from '../../utils/spotify.parser.js';
import { spotifyFetch } from "../spotify/spotifyApi.js"
import User from "../../models/user.model.js"

const MAX_FRIENDS = 60;

export default class Friends {
    static getAll = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await User.get(userInfo.id);

        if (!user) {
            throw new ApiError(404, 'User not found, Mostly an error in registeration, Please re-login and try again!');
        }

        const list = await getUsersBatch(user.friends.list, req);
        const requests = await getUsersBatch(user.friends.requests, req);
        const pending = await getUsersBatch(user.friends.pending, req);

        res.status(200).json({
            friends: {
                list: list,
                requests: requests,
                pending: pending
            }
        });
    });

    static getList = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await User.get(userInfo.id);

        if (!user) {
            throw new ApiError(404, 'User not found, Mostly an error in registeration, Please re-login and try again!');
        }

        const list = await getUsersBatch(user.friends.list, req);

        res.status(200).json({ list: list});
    });

    static getRequests = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await User.get(userInfo.id);

        if (!user) {
            throw new ApiError(404, 'User not found, Mostly an error in registeration, Please re-login and try again!');
        }

        const requests = await getUsersBatch(user.friends.requests, req);

        res.status(200).json({ requests: requests});
    });

    static getPendingRequests = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await User.get(userInfo.id);

        if (!user) {
            throw new ApiError(404, 'User not found, Mostly an error in registeration, Please re-login and try again!');
        }

        const pending = await getUsersBatch(user.friends.pending, req);

        res.status(200).json({ pending: pending});
    });

    static sendRequest = asyncHandler(async (req, res) => {
        const requestedId = req.body.id;

        if (!requestedId) {
            throw new ApiError(400, 'No id provided in request body!');
        }

        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await User.get(userInfo.id);

        if (!user) {
            throw new ApiError(404, 'User not found, Mostly an error in registeration, Please re-login and try again!');
        }

        if(user.id === requestedId) {
            throw new ApiError(400, 'You cannot send a friend request to yourself!');
        }

        if (user.friends.list.length >= MAX_FRIENDS) {
            throw new ApiError(400, 'User has reached the maximum number of friends!');
        }

        let requestedUser = await User.get(requestedId);

        if (!requestedUser) {
            throw new ApiError(404, 'User not found');
        }

        if (user.friends.list.some(friend => friend.id === requestedId)) {
            throw new ApiError(400, 'User is already a friend');
        }

        if (user.friends.pending.some(request => request.id === requestedId)) {
            throw new ApiError(400, 'Request already sent!');
        }

        if (user.friends.requests.some(request => request.id === requestedId)) {
            throw new ApiError(400, 'You already have a pending request from this user');
        }

        // OPTIMIZE THIS LATER TO USE UPDATE SOMEHOW TO ADD TO THE LIST ATLEAST RATHER THAN PUSHING AND OVERWRITING WHOLE OBJECT

        user.friends.pending.push({ id: requestedId });
        requestedUser.friends.requests.push({ id: userInfo.id });

        const userUpdate = user.save();
        const requestedUpdate = requestedUser.save();

        await userUpdate;
        await requestedUpdate;

        res.status(204).send();
    });
};

async function getUsersBatch(users, req) {
    const parsedUsers = [];

    users.forEach(async (user) => {
        const userInfo = spotifyFetch('GET', `/users/${user.id}`, req);
        parsedUsers.push(userInfo);
    });

    return Promise.all(parsedUsers.map(async user => SpotifyParser.parseFriendInfo(await user)));
}

Object.freeze(Friends);
