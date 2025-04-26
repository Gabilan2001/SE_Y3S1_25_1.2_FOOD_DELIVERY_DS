import express from "express";
import { approveDeliveryPerson, getDeliveryPersons, rejectDeliveryPerson } from "../controller/adminController.js";

const adminRouter = express.Router();

// Admin Approval Route
adminRouter.put('/approve-delivery/:id', approveDeliveryPerson);
adminRouter.get('/get-all-delivery', getDeliveryPersons);
adminRouter.put('/:id/reject', rejectDeliveryPerson);


export default adminRouter;