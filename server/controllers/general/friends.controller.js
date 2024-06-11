import asyncHandler from 'express-async-handler';

import ApiError from '../../utils/api.error.js';

import SpotifyParser from '../../utils/spotify.parser.js';
import { spotifyFetch } from "../spotify/spotifyApi.js"
import User from "../../models/user.model.js"

const MAX_FRIENDS = 60;

export default class Friends {
    static getAll = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await getUser(userInfo.id);

        const list = getUserDataBatch(user.friends.list, req);
        const requests = getUserDataBatch(user.friends.requests, req);
        const pending = getUserDataBatch(user.friends.pending, req);

        res.status(200).json({
            friends: {
                list: await list,
                requests: await requests,
                pending: await pending
            }
        });
    });

    static getList = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await getUser(userInfo.id);

        const list = await getUserDataBatch(user.friends.list, req);

        res.status(200).json({ list: list});
    });

    static getRequests = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await getUser(userInfo.id);

        const requests = await getUserDataBatch(user.friends.requests, req);

        res.status(200).json({ requests: requests});
    });

    static getPendingRequests = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await getUser(userInfo.id);

        const pending = await getUserDataBatch(user.friends.pending, req);

        res.status(200).json({ pending: pending});
    });

    static cancelPendingRequest = asyncHandler(async (req, res) => {
        const requestedId = getRequestedId(req);

        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await getUser(userInfo.id);

        if (!user.friends.pending.some(friend => friend.id === requestedId)) {
            throw new ApiError(400, 'User does not have request to this ID');
        }

        const requestedUser = await getUser(requestedId);

        const i = user.friends.pending.findIndex(request => request.id === requestedId);
        user.friends.pending.splice(i, 1);

        const j = requestedUser.friends.requests.findIndex(request => request.id === userInfo.id);
        requestedUser.friends.requests.splice(j, 1);

        const userUpdate = user.save();
        const requestedUpdate = requestedUser.save();

        await userUpdate;
        await requestedUpdate;

        res.status(204).send();
    });

    static sendRequest = asyncHandler(async (req, res) => {
        const requestedId = getRequestedId(req);

        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await getUser(userInfo.id);

        if(user.id === requestedId) {
            throw new ApiError(400, 'You cannot send a friend request to yourself!');
        }

        if (user.friends.list.length >= MAX_FRIENDS) {
            throw new ApiError(400, 'User has reached the maximum number of friends!');
        }

        let requestedUser = await getUser(requestedId);

        if (requestedUser.friends.list.length >= MAX_FRIENDS) {
            throw new ApiError(400, 'Requested user has reached the maximum number of friends!');
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

    static rejectRequest = asyncHandler(async (req, res) => {
        const requestedId = getRequestedId(req);

        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await getUser(userInfo.id);

        if (!user.friends.requests.some(friend => friend.id === requestedId)) {
            throw new ApiError(400, 'User does not have request from this ID');
        }

        const requestedUser = await getUser(requestedId);

        const i = user.friends.requests.findIndex(request => request.id === requestedId);
        user.friends.requests.splice(i, 1);

        const j = requestedUser.friends.pending.findIndex(request => request.id === userInfo.id);
        requestedUser.friends.pending.splice(j, 1);

        const userUpdate = user.save();
        const requestedUpdate = requestedUser.save();

        await userUpdate;
        await requestedUpdate;

        res.status(204).send();
    });

    static acceptRequest = asyncHandler(async (req, res) => {
        const requestedId = getRequestedId(req);

        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await getUser(userInfo.id);

        if (!user.friends.requests.some(friend => friend.id === requestedId)) {
            throw new ApiError(400, 'User does not have request from this ID');
        }

        const requestedUser = await getUser(requestedId);

        const i = user.friends.requests.findIndex(request => request.id === requestedId);
        user.friends.requests.splice(i, 1);

        const j = requestedUser.friends.pending.findIndex(request => request.id === userInfo.id);
        requestedUser.friends.pending.splice(j, 1);

        user.friends.list.push({ id: requestedId });
        requestedUser.friends.list.push({ id: userInfo.id });

        const userUpdate = user.save();
        const requestedUpdate = requestedUser.save();

        await userUpdate;
        await requestedUpdate;

        res.status(204).send();
    });

    static removeFriend = asyncHandler(async (req, res) => {
        const requestedId = getRequestedId(req);

        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await getUser(userInfo.id);

        if (!user.friends.list.some(friend => friend.id === requestedId)) {
            throw new ApiError(400, 'User is already not friends with this ID');
        }

        const requestedUser = await getUser(requestedId);

        const i = user.friends.list.findIndex(friend => friend.id === requestedId);
        user.friends.list.splice(i, 1);
        
        const j = requestedUser.friends.list.findIndex(friend => friend.id === userInfo.id);
        requestedUser.friends.list.splice(j, 1);

        const userUpdate = user.save();
        const requestedUpdate = requestedUser.save();

        await userUpdate;
        await requestedUpdate;

        res.status(204).send();
    });
};

function getRequestedId(req) {
    const requestedId = req.query.id;

    if (!requestedId) {
        throw new ApiError(400, 'No id provided in request query!');
    }

    return requestedId;
}

async function getUser(id) {
    const user = await User.get(id);

    if (!user) {
        throw new ApiError(404, 'User not found, Mostly an error in registration, Please re-login and try again!');
    }

    return user;
}

async function getUserDataBatch(users, req) {
    const parsedUsers = [];

    users.forEach(async (user) => {
        const userInfo = spotifyFetch('GET', `/users/${user.id}`, req);
        parsedUsers.push(userInfo);
    });

    return Promise.all(parsedUsers.map(async user => SpotifyParser.parseFriendInfo(await user)));
}

Object.freeze(Friends);
