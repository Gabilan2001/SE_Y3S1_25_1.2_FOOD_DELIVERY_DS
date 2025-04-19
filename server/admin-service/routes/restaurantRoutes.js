import express from "express";
import { registerRestaurant, getRestaurantDetails, updateRestaurantDetails, deleteRestaurant } from "../controllers/restaurantController.js";

const router = express.Router();

// Register route
router.post("/register", registerRestaurant);

// Fetch details of a specific restaurant (Admin)
router.get('/restaurant/:id', getRestaurantDetails);

// Update restaurant details (Admin)
router.put('/restaurant/:id', updateRestaurantDetails);

// Delete a restaurant (Admin)
router.delete('/restaurant/:id', deleteRestaurant);

export default router;
