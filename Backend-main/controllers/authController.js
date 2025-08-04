import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

export const loginUser = async (req, res) => {
  // console.log("🔥 loginUser controller hit");
  // console.log("🔐 Signing token with:", process.env.JWT_SECRET);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    // console.error("❌ Error:", err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

