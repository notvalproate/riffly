import asyncHandler from 'express-async-handler';
import SpotifyParser from '../../utils/spotify.parser.js';
import { spotifyFetch } from "../spotify/spotifyApi.js"
import User from "../../models/user.model.js"

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
