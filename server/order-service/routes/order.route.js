const express = require('express');
const { placeOrder, getOrdersByUser, updateOrderStatus, deleteOrder, getOrderStatus, updateOrder } = require('../controller/order.controller');
const router = express.Router();
const authO = require('../middleware/authO');
const authenticate =require('../middleware/authMiddleware')


router.post('/place',authenticate, placeOrder);
router.get('/:userId', authenticate, getOrdersByUser);//delete authO and check postman
router.put('/update/:orderId', authenticate, updateOrderStatus);
router.delete('/delete/:orderId', authenticate, deleteOrder);
router.get('/status/:orderId', authenticate, getOrderStatus);
router.put('/updateOrder/:orderId', authenticate, updateOrder);

module.exports = router;

