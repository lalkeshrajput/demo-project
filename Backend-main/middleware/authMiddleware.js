import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
// console.log("🧪 JWT_SECRET used to verify:", process.env.JWT_SECRET);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    // console.error("❌ Token error:", err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

