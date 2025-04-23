/*const Order = require('../models/order.model');

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const { userId } = req;  // Get the userId from the request (added by the auth middleware)
        const { restaurantId, items, totalPrice } = req.body;

        // Create a new order and associate it with the userId (authenticated user)
        const newOrder = new Order({
            userId,
            restaurantId,
            items,
            totalPrice
        });

        // Save the new order to the database
        await newOrder.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder
        });
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

exports.trackOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  


module.exports = { placeOrder, getOrdersByUser, updateOrderStatus, deleteOrder, getOrderStatus, updateOrder };
*/

const Order = require('../models/order.model');
const Product = require('../models/product.model');  // Ensure correct path
const Restaurant = require('../models/restaurant.model');  // Ensure correct path


// Place a new order
/*const placeOrder = async (req, res) => {
    try {
        const { userId } = req;  // Get the userId from the request (added by the auth middleware)
        const { restaurantId, items, totalPrice } = req.body;

        // Create a new order and associate it with the userId (authenticated user)
        const newOrder = new Order({
            userId,
            restaurantId,
            items,
            totalPrice,
            status: 'Pending' // Default status when an order is placed
        });

        // Save the new order to the database
        await newOrder.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};*/

const placeOrder = async (req, res) => {
    try {
        const { userId } = req;  // Get the userId from authentication middleware
        const { restaurantId, items } = req.body;

        // Fetch restaurant details
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        let totalPrice = 0;
        const orderItems = [];

        // Fetch product details for each item in the order
        for (let i = 0; i < items.length; i++) {
            const product = await Product.findById(items[i].productId);  // Fetch product by productId
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${items[i].productId} not found` });
            }

            // Calculate the total price for the items
            const itemTotalPrice = product.price * items[i].quantity;
            totalPrice += itemTotalPrice;

            // Add product details (name, price, etc.) to order items
            orderItems.push({
                productId: product._id,
                name: product.name,  // Get the name of the product
                quantity: items[i].quantity,
                price: product.price  // Get the price of the product
            });
        }

        // Create the new order
        const newOrder = new Order({
            userId,
            restaurantId,
            items: orderItems,
            totalPrice,
            status: 'Pending'  // Default status for new orders
        });

        // Save the new order to the database
        await newOrder.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get all orders for a user
const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req;  // Ensure we are getting the authenticated user's orders
        const orders = await Order.find({ userId });
        
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const validStatuses = ['Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];
// Update order status (only allowed for specific states like 'Pending')
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only allow updating the status if the order is in 'Pending' state
        /*if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'Order cannot be modified after confirmation' });
        }*/

        // Update order status
        order.status = status;
        await order.save();

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete order
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

// Get order status (view order by ID)
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

// Update order items
const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { items } = req.body; // Expecting an array of { productId, quantity }

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Ensure the order is still in 'Pending' status before allowing updates
        if (order.status !== "Pending") {
            return res.status(400).json({ message: "Order cannot be modified after confirmation" });
        }

        // Update only the quantity of existing items in the order
        if (items && Array.isArray(items)) {
            items.forEach((updatedItem) => {
                const existingItem = order.items.find(item => item.productId === updatedItem.productId);
                if (existingItem) {
                    existingItem.quantity = updatedItem.quantity;  // Update quantity
                }
            });
        }

        // Save the updated order
        await order.save();
        res.json({ message: "Order items updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


module.exports = { 
    placeOrder, 
    getOrdersByUser, 
    updateOrderStatus, 
    deleteOrder, 
    getOrderStatus, 
    updateOrder, 
    
};
