


// models/Order.js
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  deliveryType: {
    type: String,
    enum: ['Home Delivery', 'Pickup', 'Delivery'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'PayPal'],
    required: true
  },
  items: [ItemSchema], // Items in the order
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['processing', 'accepted', 'in_progress', 'delivered', 'canceled'],
    default: 'processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  estimatedDeliveryTime: {
    type: Date
  },
  location: {
    type: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null }
    },
    default: {}
  },
  deliveryPerson: {  // Reference to the DeliveryBoy model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryBoy'  // Reference to the DeliveryBoy model
  },
  tracking: {  // Reference to the Tracking model (if needed)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tracking'
  }

}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
export default Order;
