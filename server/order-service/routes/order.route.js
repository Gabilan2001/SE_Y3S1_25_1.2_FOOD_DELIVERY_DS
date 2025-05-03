const express = require('express');
const { placeOrder, getOrdersByUser, updateOrderStatus, deleteOrder, getOrderStatus, updateOrder } = require('../controller/order.controller');
const router = express.Router();

router.post('/place', placeOrder);
router.get('/:userId', getOrdersByUser);
router.put('/update/:orderId', updateOrderStatus);
router.delete('/delete/:orderId',deleteOrder);
router.get('/status/:orderId',getOrderStatus);
router.put('/updateOrder/:orderId', updateOrder);

module.exports = router;

