import Notification from '../models/notification.js';

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user_id: req.user._id });
  res.json(notifications);
};

export const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.send('Marked as read');
};
