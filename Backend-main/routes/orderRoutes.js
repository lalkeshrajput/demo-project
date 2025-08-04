import express from 'express';
const router = express.Router();
import { createOrder, getOrders,getOwnerOrders , checkout,markAsDelivered,markAsReturned,updateOrderStatus} from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.get('/owner', verifyToken, getOwnerOrders); // ✅ Owner's rental orders
router.post('/checkout', verifyToken, checkout);
router.post('/selected', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { itemIds } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ error: 'No item IDs provided' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.item_id');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const selectedItems = cart.items.filter(item =>
      itemIds.includes(item._id.toString())
    );

    return res.json({ cartItems: selectedItems });
  } catch (error) {
    console.error('Error fetching selected cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// PATCH /api/orders/:id/status
router.patch('/:orderId/status', verifyToken, updateOrderStatus);
router.patch('/:orderId/deliver', verifyToken, markAsDelivered);
router.patch('/:orderId/return', verifyToken, markAsReturned);


export default router;

