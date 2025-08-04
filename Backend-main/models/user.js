import mongoose from 'mongoose';
// const { use } = require('react');


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  isAdmin: { type: Boolean, default: false },
  cart: [
    {
      item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      rental_type: { type: String, enum: ['per_day', 'per_week', 'per_month'] },
      rental_start_date: Date,
      rental_end_date: Date,
      quantity: Number
    }
  ]
}, { timestamps: true });


const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
