import asyncHandler from 'express-async-handler';

import ApiError from '../../utils/api.error.js';

import { spotifyFetch } from "../spotify/spotifyApi.js"

export default class Recommender {
    static getRecommendationsBySong = asyncHandler(async (req, res) => {
        const songId = req.query.songId;

        if(!songId) {
            throw new ApiError(400, 'Missing songId query parameter');
        }

        const params = new URLSearchParams({
            seed_tracks: songId,
            limit: 12,
        });

        const recommendations = await spotifyFetch('GET', '/recommendations?' + params.toString(), req);
        const recs = recommendationsParser(recommendations);

        res.status(200).json(recs);
    });
};

function recommendationsParser(recommendations) {
    const recs = [];

    for(let i = 0; i < recommendations.tracks.length; i++) {
        let track = recommendations.tracks[i];

        recs.push({
            id: track.id,
            name: track.name,
            url: track.external_urls.spotify,
            image: track.album.images[0].url,
        });
    }

    return recs;
}

Object.freeze(Recommender);
