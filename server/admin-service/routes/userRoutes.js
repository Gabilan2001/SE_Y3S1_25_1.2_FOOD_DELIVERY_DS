import express from 'express';
import { createUser, getAllUsers, updateUser, deleteUser, changeUserRole } from '../controllers/userController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js'; // Use protect and isAdmin middleware

const router = express.Router();

// POST request to create a new user (Admin only)
router.post('/create-user', protect, isAdmin, createUser); // Change to POST

// Other routes
router.get('/all-users', protect, isAdmin, getAllUsers);
router.put('/update-user/:id', protect, isAdmin, updateUser);
router.delete('/delete-user/:id', protect, isAdmin, deleteUser);
router.put('/change-user-role/:id', protect, isAdmin, changeUserRole);

export default router;
