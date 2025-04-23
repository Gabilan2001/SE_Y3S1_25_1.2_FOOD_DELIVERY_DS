const Product = require('../models/product.model');  // Make sure the path is correct
const Restaurant = require('../models/restaurant.model');  // Make sure the path is correct

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, price, restaurantId } = req.body;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const newProduct = new Product({
            name,
            price,
            restaurantId
        });

        await newProduct.save();

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { addProduct };
