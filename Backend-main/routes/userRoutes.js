import express from 'express';
import { createUser, 
    createUserAndRedirect,
    loginUserAndRedirect,
   
    deleteUser,
    getLoggedInUser,
   changePassword,
    clearUserCart,
updateProfile}
    // getAllUsers } 
    from '../controllers/userController.js';

import { verifyToken,verifyAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

// Public routes
router.post('/', createUser);                        // Signup API
router.post('/form', createUserAndRedirect);         // Signup via HTML form
router.post('/login', loginUserAndRedirect);         // Login via form
router.delete('/cart/clear', verifyToken, clearUserCart);
// Protected routes
// router.get('/admin/users', verifyToken, verifyAdmin, getUsers); // ✅ Admin only
router.patch('/update', verifyToken, updateProfile);
router.patch('/change-password', verifyToken, changePassword);

router.delete('/:id', verifyToken, deleteUser);      // Delete user (auth required)
router.get('/profile', verifyToken, getLoggedInUser);

export default router;

