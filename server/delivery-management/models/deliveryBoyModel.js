
// models/DeliveryBoy.js
import mongoose from 'mongoose';

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: false },
  profileImage: { type: String, default: '' },
  vehicleDetails: {
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true }
  },
  assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  onlineStatus: { type: Boolean, default: false },
  location: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 }
  },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  totalDeliveries: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  documents: {
    idProof: { type: String, default: '' },
    vehicleLicense: { type: String, default: '' }
  }
}, { timestamps: true });

const DeliveryBoy = mongoose.model('DeliveryBoy', deliveryBoySchema);
export default DeliveryBoy;
