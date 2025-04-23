const mongoose = require('mongoose');

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
