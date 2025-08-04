import Order from '../models/order.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const createOrder = async (req, res) => {
  try {
    const {
      item_id,
      quantity,
      rentalPeriod,
      startDate,
      endDate,
      totalAmount
    } = req.body;

    const newOrder = new Order({
      renter_id: req.user.id,
      items: [
        {
          item_id,
          quantity,
          rentalPeriod,
          startDate,
          endDate
        }
      ],
      totalAmount
    });

    await newOrder.save();
    res.status(201).json({ message: 'Booking confirmed', order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ renter_id: req.user.id })
      .populate('renter_id', 'name email phone')
      .populate({
        path: 'items.item_id',
        model: 'Item',
        select: 'title description pricing images'
      });

    // Remove any items where item_id is null (e.g., item deleted)
    const cleanedOrders = orders.map(order => ({
      ...order._doc,
      items: order.items.filter(i => i.item_id !== null)
    }));

    res.status(200).json(cleanedOrders);
  } catch (err) {
    console.error('❌ Failed to get orders:', err);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};





export const getOwnerOrders = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const orders = await Order.find({ 'items.owner_id': ownerId })
      .populate('renter_id', 'name email phone')
      .populate('items.item_id');

    const filtered = orders.map(order => ({
      ...order._doc,
      items: order.items.filter(i => i.owner_id.toString() === ownerId)
    }));

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching owner orders' });
  }
};




import Item from '../models/item.js';

export const checkout = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

   

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }
    const renter_id = req.user._id;
    console.log("👤 Renter ID:", renter_id);
    console.log("🛒 Checkout request body:", req.body);
    // ✅ Enrich each item with owner_id
    const orderItems = await Promise.all(
  items.map(async (item) => {
    const itemDoc = await Item.findById(item.item_id).lean();  // ✅ Define itemDoc here
      if (!itemDoc) throw new Error(`Item not found for ID ${item.item_id}`);

    return {
      item_id: item.item_id,
      owner_id: itemDoc.owner_id, // ✅ Include required owner_id
      quantity: item.quantity,
      rentalPeriod: item.rentalPeriod,
      startDate: item.startDate,
      endDate: item.endDate
    };
  })
);
    const newOrder = new Order({
      renter_id: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      status: 'pending'
    });

    await newOrder.save();
 await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });
    res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('❌ Order creation failed:', err);
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/orders/:orderId/deliver
export const markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: 'Delivered' },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as delivered' });
  }
};

// PATCH /api/orders/:orderId/return
export const markAsReturned = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: 'Returned' },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as returned' });
  }
};
// PATCH /api/orders/:orderId/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    console.error('❌ Failed to update order status:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
