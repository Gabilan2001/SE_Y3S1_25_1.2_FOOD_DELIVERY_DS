import express from 'express';
import { acceptOrder, createOrder, getAllOrders, markOrderAsDelivered, rejectOrder } from '../controller/ItemController.js';

const itemRouter = express.Router();

itemRouter.post('/orders',createOrder)
itemRouter.get('/orders',getAllOrders)
itemRouter.put('/orders/:id/accept', acceptOrder);

// Route to reject an order
itemRouter.put('/orders/:id/reject', rejectOrder);
// router.put('/orders/:id/status', updateOrderStatus);
itemRouter.put("/orders/:id/deliver", markOrderAsDelivered);
export default itemRouter