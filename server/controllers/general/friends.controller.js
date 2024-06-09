import asyncHandler from 'express-async-handler';

import ApiError from '../../utils/api.error.js';

import SpotifyParser from '../../utils/spotify.parser.js';
import { spotifyFetch } from "../spotify/spotifyApi.js"
import User from "../../models/user.model.js"

const MAX_FRIENDS = 60;

export default class Friends {
    static getList = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await User.get(userInfo.id);

        if (!user) {
            throw new ApiError(404, 'User not found, Mostly an error in registeration, Please re-login and try again!');
        }

        const friends = await getUsersBatch(user.friends.list);

        res.status(200).json({ friendsList: friends});
    });

    static getRequests = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await User.get(userInfo.id);

        if (!user) {
            throw new ApiError(404, 'User not found, Mostly an error in registeration, Please re-login and try again!');
        }

        const pendingRequests = await getUsersBatch(user.friends.requests);

        res.status(200).json({ pendingRequests: pendingRequests});
    });

    static sendRequest = asyncHandler(async (req, res) => {
        let userInfo = await spotifyFetch('GET', '/me', req);

        const user = await User.get(userInfo.id);

        if (!user) {
            throw new ApiError(404, 'User not found, Mostly an error in registeration, Please re-login and try again!');
        }

        if (user.friends.list.length >= MAX_FRIENDS) {
            throw new ApiError(400, 'User has reached the maximum number of friends!');
        }

        const requestedId = req.body.id;

        if (!requestedId) {
            throw new ApiError(400, 'No id provided in request body!');
        }

        let requestedUser = await User.get(requestedId);

        if (!requestedUser) {
            throw new ApiError(404, 'User not found');
        }

        if (user.friends.list.some(friend => friend.id === requestedId)) {
            throw new ApiError(400, 'User is already a friend');
        }

        if (user.friends.requests.some(request => request.id === requestedId)) {
            throw new ApiError(400, 'Request already sent');
        }

        if (user.friends.pending.some(request => request.id === requestedId)) {
            throw new ApiError(400, 'You already have a pending request from this user');
        }

        const userUpdate = User.update({
            id: user.id,
        }, {
            friends: {
                pending: {
                    $ADD: {
                        id: requestedId,
                    },
                },
            },
        });

        const requestedUpdate = User.update({
            id: requestedId,
        }, {
            friends: {
                requests: {
                    $ADD: {
                        id: user.id,
                    },
                },
            },
        });

        await userUpdate;
        await requestedUpdate;

        res.status(204).send();
    });
};

async function getUsersBatch(users) {
    const parsedUsers = [];

    users.forEach(async (user) => {
        const userInfo = spotifyFetch('GET', `/users/${user.id}`, req);
        parsedUsers.push(userInfo);
    });

    return Promise.all(parsedUsers.map(async user => SpotifyParser.parseFriendInfo(await user)));
}

Object.freeze(Friends);
