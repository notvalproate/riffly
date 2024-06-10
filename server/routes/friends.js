import express from 'express';
import Friends from '../controllers/general/friends.controller.js';

const router = express.Router();

router.get('/', Friends.getAll);

router.get('/list', Friends.getList);
router.delete('/list', Friends.removeFriend);

router.get('/pending', Friends.getPendingRequests);
router.delete('/pending', Friends.cancelPendingRequest);

router.get('/requests', Friends.getRequests);
router.post('/request', Friends.sendRequest);
router.put('/request', Friends.acceptRequest);
router.delete('/request', Friends.rejectRequest);

export default router;
