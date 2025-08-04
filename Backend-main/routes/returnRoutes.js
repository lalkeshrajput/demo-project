import express from 'express';
import { requestReturn, getReturnRequests } from '../controllers/returnController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', verifyToken, requestReturn);
router.get('/', verifyToken, getReturnRequests);
export default router;
