import User from '../models/user.js';
import Item from '../models/item.js';
import Order from '../models/order.js';
// import ReturnRequest from '../models/returnRequest.js';
import Notification from '../models/notification.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('renter_id', 'name email').populate('item_id', 'title');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
};

export const getAllReturns = async (req, res) => {
  try {
    const returns = await ReturnRequest.find().populate('order_id').populate('user_id', 'name email');
    res.status(200).json(returns);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch returns', error: err.message });
  }
};

// export const processReturn = async (req, res) => {
//   try {
//     const request = await ReturnRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
//     res.status(200).json(request);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to process return', error: err.message });
//   }
// };

export const sendNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send notification', error: err.message });
  }
};
