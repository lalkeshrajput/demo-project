import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  // owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  title: { type: String, required: true },
  description: String,
  pricing: {
    per_day: { type: Number, required: true },
    per_week: { type: Number },
    per_month: { type: Number }
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Used'],
    default: 'Good'
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: { type: Array, required: true },
  status: { type: String, enum: ['available', 'rented', 'maintenance'], default: 'available' },
  quantity: { type: Number, default: 1 },
  rental_start_date: Date,
  rental_end_date: Date,
  deposit: { type: Number, default: 0 },
  location: { type: String, required: true },

  // ✅ Add this:
  isFeatured: { type: Boolean, default: false }
});

const Item = mongoose.models.Item|| mongoose.model('Item', itemSchema);
export default Item;