import express from 'express';
import Friends from '../controllers/general/friends.controller.js';

const router = express.Router();

router.get('/', Friends.getAll);
router.get('/list', Friends.getList);
router.get('/requests', Friends.getRequests);
router.get('/pending', Friends.getPendingRequests);

router.put('/request', Friends.sendRequest);
router.delete('/request', Friends.rejectRequest);

export default router;
