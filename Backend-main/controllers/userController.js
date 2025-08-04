import bcrypt from 'bcryptjs';
import User from '../models/user.js';  // Make sure path is correct
import jwt from 'jsonwebtoken';
export const getAllUsers = async (req, res) => {
  try {
    console.log("🔍 Admin fetching all users");
    const users = await User.find().select('-password'); // hide password
    console.log("✅ Total users found:", users.length);
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error in getAllUsers:", err.message);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};


export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address
    });

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const createUserAndRedirect = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send('All fields are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address
    });

    // ✅ Redirect to homepage after signup
    res.redirect('/');
  } 
  catch (err) {
    res.status(500).send('Server error');
  }
};

export const loginUserAndRedirect = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid email or password');

    // 🔐 Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // ✅ Send token to client (Postman/browser)
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send('User not found');
    res.send('User deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting user');
  }
};
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // ✅ Get user from token
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
    });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};

export const clearUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = []; // Clear the cart array
    await user.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Failed to clear cart:', err);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};


export const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

