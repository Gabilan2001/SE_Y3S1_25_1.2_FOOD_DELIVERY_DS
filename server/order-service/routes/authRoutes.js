// routes/authRoutes.js
const express = require("express");
const { login, register } = require("../controller/authController");
const { addRestaurant } = require('../controller/restaurantController');
const { addProduct } = require('../controller/productController');
//const { placeOrder } = require('../controller/orderController');


const router = express.Router();

// POST request for login
router.post("/login", login);

// POST request for registration
router.post("/register", register);

// Add restaurant
router.post("/restaurants/add", addRestaurant);

// Add product
router.post("/products/add", addProduct);


module.exports = router;
