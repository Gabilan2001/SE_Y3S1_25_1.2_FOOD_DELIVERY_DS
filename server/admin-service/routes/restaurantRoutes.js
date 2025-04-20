import express from "express";
import {
  registerRestaurant,
  verifyRestaurant,
  getRestaurantDetails,
  updateRestaurantDetails,
  deleteRestaurant,
} from "../controllers/restaurantController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerRestaurant);

// Admin-only actions
router.put("/verify-restaurant/:id", protect, isAdmin, verifyRestaurant);

router.get("/:id", protect, isAdmin, getRestaurantDetails);
router.put("/:id", protect, isAdmin, updateRestaurantDetails);
router.delete("/:id", protect, isAdmin, deleteRestaurant);

export default router;
