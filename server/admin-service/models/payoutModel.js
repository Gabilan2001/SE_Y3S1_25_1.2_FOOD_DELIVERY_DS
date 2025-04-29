// models/payoutModel.js
import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  amount: { type: Number, required: true }, // The payout amount to the restaurant
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // Payout status
  payoutDate: { type: Date, default: Date.now },
});

const Payout = mongoose.model('Payout', payoutSchema);
export default Payout;
