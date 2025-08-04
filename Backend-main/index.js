import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db.js';

import { User, Item, Category, Order, Payment } from './models/index.js'; // ensure all are exported from models/index.js

const createUser = async () => {
  const user = await User.create({
    name: "sarthak",
    email: "sarthak_shah@example.com",
    password: "pass123",
    phone: "9888888999",
    address: "Mumbai, India",
    cart: [] // new cart structure inside user
  });
  console.log("✅ User Saved:", user);
  return user;
};

const createCategory = async () => {
  const category = await Category.create({
    title: "Furniture",
    image: "https://example.com/furniture.jpg"
  });
  console.log("✅ Category Saved:", category);
  return category._id;
};

const createItem = async (ownerId, categoryId) => {
  const item = await Item.create({
    title: "Wooden Dinning Table",
    description: "Solid wood dining table with 4 chairs",
    owner_id: ownerId,
    category: categoryId,
    pricing: {
      per_day: 50,
      per_week: 300,
      per_month: 1000
    },
    availability: true,
    security_deposit: 500,
    quantity: 2
  });
  console.log("✅ Item Saved:", item);
  return item;
};

const updateUserCart = async (userId, itemId) => {
  const cartItem = {
    item_id: itemId,
    rental_type: 'per_day',
    rental_start_date: new Date('2025-07-01'),
    rental_end_date: new Date('2025-07-05'),
    quantity: 1
  };

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { cart: cartItem } },
    { new: true }
  );

  console.log('✅ Cart added to user:', updatedUser.cart);
};

const createOrder = async (userId, itemId) => {
  const order = await Order.create({
    user_id: userId,
    item_id: itemId,
    status: 'confirmed',
    rental_type: 'per_day',
    rental_start_date: new Date('2025-07-01'),
    rental_end_date: new Date('2025-07-05'),
    quantity: 1
  });

  console.log("✅ Order Saved:", order);
  return order._id;
};

const createPayment = async (orderId, amount) => {
  const payment = await Payment.create({
    rental: orderId,
    amount: amount,
    paymentMethod: 'UPI',
    status: 'completed'
  });

  console.log(" Payment Saved:", payment);
  return payment._id;
};

const run = async () => {
  try {
    await connectDB();
    // await mongoose.connection.dropDatabase();
    // console.log(" Dropped old DB");

    const user = await createUser();
    const categoryId = await createCategory();
    const item = await createItem(user._id, categoryId);

    await updateUserCart(user._id, item._id);

    const orderId = await createOrder(user._id, item._id);
    const paymentId = await createPayment(orderId, 50 * 5);
      console.log(" Payment ID:", paymentId);


    mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    mongoose.disconnect();
  }
};

run();


