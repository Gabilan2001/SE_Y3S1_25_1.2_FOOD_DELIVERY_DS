// routes/adminPaymentRoutes.js
import express from 'express';
import { getPaymentHistory, processPayout } from '../controllers/paymentController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';  // Protect and isAdmin middlewares

const router = express.Router();

// Get payment history (Admin only)
router.get('/payment-history', protect, isAdmin, getPaymentHistory);

// Process restaurant payout (Admin only)
router.post('/process-payout', protect, isAdmin, processPayout);

export default router;
