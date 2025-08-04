import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  rentalPeriod: {
    type: String,
    enum: ['day', 'week', 'month'],
    default: 'day'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

const addressSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  landmark: String,
  addressType: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  renter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [itemSchema],
  shippingAddress: addressSchema,
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
  type: String,
  enum: ['COD', 'CARD', 'UPI'], // or whatever methods you support
  default: 'COD'
},

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;


