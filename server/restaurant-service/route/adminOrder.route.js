// route/adminOrder.route.js
import express from 'express';
import { getAllAdminOrders } from '../controllers/adminOrder.controller.js';

const router = express.Router();

// Route for fetching all orders for the admin
router.get('/', getAllAdminOrders);

export default router;
