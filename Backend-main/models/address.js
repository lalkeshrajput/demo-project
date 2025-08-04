import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: { type: String },
  addressType: { type: String, enum: ['home', 'office'], default: 'home' },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);
export default Address;
