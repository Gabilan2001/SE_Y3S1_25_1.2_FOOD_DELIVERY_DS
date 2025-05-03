import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  testAdmin,
} from '../controllers/authController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/admin/test', protect, isAdmin, testAdmin);

export default router;
