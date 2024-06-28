import express from 'express';
import Recommender from '../controllers/general/recommender.controller.js';

const router = express.Router();

router.get('/', Recommender.getRecommendationsBySong);

export default router;
