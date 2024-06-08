import asyncHandler from 'express-async-handler';
import { spotifyFetch } from "../spotify/spotifyApi.js"

export default class Friends {
    static getList = asyncHandler(async (req, res) => {
        
    });

    static getRequests = asyncHandler(async (req, res) => {
        
    });
};

Object.freeze(Friends);
