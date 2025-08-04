import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';
import User from '../models/user.js';
import {
  getAllUsers,
  deleteUser,
  getAllItems,
  deleteItem,
  getAllOrders,
  updateOrderStatus,
  getAllReturns,
//   processReturn,
  sendNotification
} from '../controllers/adminController.js'
const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/items', getAllItems);
router.delete('/items/:id', deleteItem);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/returns', getAllReturns);
// router.put('/returns/:id', processReturn);

router.post('/notifications', sendNotification);

export default router;


