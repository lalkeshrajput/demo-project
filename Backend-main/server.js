// require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'
import connectDB from './db.js';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import categoryRoutes from "./routes/categoryRoutes.js";
import addressRoutes from './routes/addressRoutes.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// api
const app = express();

// middleware
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
console.log("✅ JWT_SECRET in server.js:",process.env.JWT_SECRET);

app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/addresses', addressRoutes);

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);

//react connection

// app.use(express.static(path.join(__dirname, 'rentkart-client', 'build')));
// app.get('/*', function (req, res) {
//   res.sendFile(path.resolve(__dirname, 'rentkart-client', 'build', 'index.html'));
// });

// Serve frontend only if build exists
import fs from 'fs';
const frontendIndexPath = path.resolve(__dirname, 'rentkart-client', 'build', 'index.html');
const frontendBuildPath = path.resolve(__dirname, 'rentkart-client', 'build');

// Serve static files
if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendBuildPath));

  // ✅ Safe catch-all for frontend in Express 5
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/admin')) {
      res.sendFile(frontendIndexPath);
    } else {
      next();
    }
  });
}


// app.use((req, res) => {
//   res.status(404).send('Page Not Found' );
// });


const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
};

startServer(); // ✅ call the function here