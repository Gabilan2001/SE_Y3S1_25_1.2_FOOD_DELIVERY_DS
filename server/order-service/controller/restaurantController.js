const Restaurant = require('../models/restaurant.model');  // Make sure the path is correct

// Add a new restaurant
const addRestaurant = async (req, res) => {
    try {
        const { name, address, contact } = req.body;

        const newRestaurant = new Restaurant({
            name,
            address,
            contact
        });

        await newRestaurant.save();

        res.status(201).json({
            message: 'Restaurant added successfully',
            restaurant: newRestaurant
        });
    } catch (error) {
        console.error('Error adding restaurant:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { addRestaurant };
