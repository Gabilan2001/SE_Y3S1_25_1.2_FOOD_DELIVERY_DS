const Order = require('../models/order.model');

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const { userId, restaurantId, items, totalPrice } = req.body;
        const newOrder = new Order({ userId, restaurantId, items, totalPrice });
        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all orders for a user
const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order deleted successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.json({ orderId: order._id, status: order.status });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { items } = req.body; // Expecting an array of { productId, quantity }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Only allow updates if the order is still Pending
        if (order.status !== "Pending") {
            return res.status(400).json({ message: "Order cannot be modified after confirmation" });
        }

        // Update only the quantity of existing items
        if (items && Array.isArray(items)) {
            items.forEach((updatedItem) => {
                const existingItem = order.items.find(item => item.productId === updatedItem.productId);
                if (existingItem) {
                    existingItem.quantity = updatedItem.quantity;
                }
            });
        }

        // Save updated order
        await order.save();
        res.json({ message: "Order items updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};




module.exports = { placeOrder, getOrdersByUser, updateOrderStatus, deleteOrder, getOrderStatus, updateOrder };
