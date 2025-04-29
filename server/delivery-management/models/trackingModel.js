
import mongoose from 'mongoose';

const TrackingSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    deliveryPersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy', required: true },
    
    currentLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        updatedAt: { type: Date, default: Date.now }
    },

    estimatedDeliveryTime: { type: Date },
    actualDeliveryTime: { type: Date },
    distanceCovered: { type: Number, default: 0 },

    status: {
        type: String,
        enum: ['Accepted', 'In Progress', 'Delivered', 'Canceled'],
        required: true
    },

    // Status change history for better tracking
    statusHistory: [
        {
            status: { type: String },
            updatedAt: { type: Date, default: Date.now }
        }
    ],

    notes: { type: String },
    proofOfDelivery: { type: String, default: '' }

}, { timestamps: true });

const Tracking = mongoose.model('Tracking', TrackingSchema);
export default Tracking;
