import express from 'express';
import Friends from '../controllers/general/friends.controller';

const router = express.Router();

router.get('/list', Friends.getList);
router.get('/requests', Friends.getRequests);

export default router;
