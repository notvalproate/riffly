import express from 'express';
import Friends from '../controllers/general/friends.controller.js';

const router = express.Router();

router.get('/list', Friends.getList);
router.get('/requests', Friends.getRequests);
router.get('/pending', Friends.getPendingRequests);
router.post('/request', Friends.sendRequest);

export default router;
