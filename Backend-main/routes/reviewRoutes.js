import express from 'express';
import { addReview, getItemReviews } from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', verifyToken, addReview);
router.get('/:id', getItemReviews);
export default router;
