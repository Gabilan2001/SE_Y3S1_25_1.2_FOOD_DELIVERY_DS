import { changePassword, getOrderById, loginDeliveryPerson, registerDeliveryPerson } from "../controllers/deliveryBoyController.js";
import express from 'express';  // Correct import of express
import { uploadDeliveryPersonFiles } from "../middlewares/multer.js";

const deliveryBoy = express.Router();

deliveryBoy.post('/register', uploadDeliveryPersonFiles, registerDeliveryPerson);
deliveryBoy.post('/login', loginDeliveryPerson);
deliveryBoy.put('/change-password/:id', changePassword);
// deliveryBoy.put('/update-location/:id', updateLocation);
deliveryBoy.get('/:orderId', getOrderById);
export default deliveryBoy;

