import asyncHandler from 'express-async-handler';
import { spotifyFetch } from "../spotify/spotifyApi"

export default class Friends {
    static getList = asyncHandler(async (req, res) => {
        
    });

    static getRequests = asyncHandler(async (req, res) => {
        
    });
};

Object.freeze(Friends);
