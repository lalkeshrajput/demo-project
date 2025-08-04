import express from 'express';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAddresses);
router.post('/', verifyToken, createAddress);
router.put('/:id', verifyToken, updateAddress);
router.delete('/:id', verifyToken, deleteAddress);

export default router;

