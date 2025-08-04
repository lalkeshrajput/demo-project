import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  
},{ timestamps: true });

// const feedback = mongoose.model('Feedback', feedbackSchema);
// module.exports = feedback;
const feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
export default feedback;