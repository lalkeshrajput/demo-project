import mongoose from 'mongoose';
const returnRequestSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

// const ReturnRequest = mongoose.model('ReturnRequest', returnRequestSchema);
// module.exports = ReturnRequest;
// module.exports = mongoose.models.ReturnRequest || mongoose.model('ReturnRquest', returnRequestSchema);
const ReturnRequest = mongoose.models.ReturnRequest || mongoose.model('ReturnRquest', returnRequestSchema);
export default ReturnRequest;