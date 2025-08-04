import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({

  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  is_read: { type: Boolean, default: false }
}, { timestamps: true });

// const Notification = mongoose.model('Notification', notificationSchema);
// module.exports = Notification;
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;