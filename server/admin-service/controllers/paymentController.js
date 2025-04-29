// controllers/paymentController.js
import Payment from '../models/paymentModel.js';
import Payout from '../models/payoutModel.js';
import Restaurant from '../models/restaurantModel.js';


// Get all payment transactions (Admin only)
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find().populate('orderId restaurantId'); // Populate order and restaurant details
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment history', error: error.message });
  }
};

// Process Payout for a restaurant after deducting platform commission
export const processPayout = async (req, res) => {
    const { orderId, restaurantId } = req.body;
  
    try {
      const orderPayment = await Payment.findOne({ orderId, restaurantId, status: 'completed' });
      const restaurant = await Restaurant.findById(restaurantId);
  
      if (!orderPayment || !restaurant) {
        return res.status(404).json({ message: 'Order payment or restaurant not found' });
      }
  
      const platformCommission = 0.1; // 10% commission for the platform
      const payoutAmount = orderPayment.amount - (orderPayment.amount * platformCommission); // Amount after commission
  
      const payout = new Payout({
        orderId,
        restaurantId,
        amount: payoutAmount,
        status: 'pending',
      });
  
      await payout.save();
  
      res.status(200).json({ message: 'Payout request created successfully', payout });
    } catch (error) {
      res.status(500).json({ message: 'Error processing payout', error: error.message });
    }
  };