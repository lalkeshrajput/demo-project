import express from 'express';
const router = express.Router();
import { createPayment, getPayments } from '../controllers/paymentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.post('/', verifyToken, createPayment);
router.get('/', verifyToken, getPayments);

export default router;

