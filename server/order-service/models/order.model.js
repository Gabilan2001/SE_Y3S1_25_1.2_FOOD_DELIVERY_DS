/*const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    items: [
        {
            productId: { type: String, required: true },
            name: String,
            quantity: Number,
            price: Number,
        },
    ],
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
*/

const mongoose = require('mongoose');

// Define the Order schema
const OrderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true 
    },
    restaurantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant', // Reference to the Restaurant model
        required: true 
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing','Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    deliveryDetails: {
        deliveryPerson: String, // Delivery person name (optional)
        contactInfo: String,    // Delivery person contact info (optional)
        estimatedTime: Date,    // Estimated delivery time (optional)
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }, // To track when the order status was last updated
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
});

// Middleware to update the updatedAt field whenever an order is updated
OrderSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        this.updatedAt = Date.now();
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
