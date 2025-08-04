// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
//   paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI'], required: true },
//   amount: { type: Number, required: true },
//   paymentDate: { type: Date, default: Date.now },
//   status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
// });

// // const payment = mongoose.model('Payment', paymentSchema);
// // module.exports = payment;
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI'], required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
});

const payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default payment;
// module.exports = mongoose.models.Payments || mongoose.model('Payment', paymentSchema);
