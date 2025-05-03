import nodemailer from "nodemailer";
import Restaurant from "../models/restaurantModel.js";

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rashadfaris4675@gmail.com",
    pass: "dxtu yugd wgei apvr", // App password, keep secret!
  },
});

// Register a new restaurant
const registerRestaurant = async (req, res) => {
  const { name, owner, email, phone, address, category } = req.body;

  try {
    if (!name || !owner || !email || !phone || !address || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newRestaurant = new Restaurant({
      name, owner, email, phone, address, category,
      status: "pending",
    });

    await newRestaurant.save();

    const mailOptions = {
      from: "rashadfaris4675@gmail.com",
      to: email,
      subject: "Restaurant Registration Successful",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Dear ${owner},</p>
        <p>Your restaurant has been registered and is pending admin approval.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error("Email error:", error);
    });

    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant: newRestaurant,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve/Reject restaurant (Admin only)
const verifyRestaurant = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const mailOptions = {
      from: "rashadfaris4675@gmail.com",
      to: restaurant.email,
      subject: `Restaurant ${status.toUpperCase()}`,
      html: `
        <p>Dear ${restaurant.owner},</p>
        <p>Your restaurant <strong>${restaurant.name}</strong> has been <strong>${status}</strong> by the admin.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error("Email error:", error);
    });

    res.status(200).json({
      message: `Restaurant ${status} successfully`,
      restaurant,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one restaurant (Admin)
const getRestaurantDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update restaurant (Admin)
const updateRestaurantDetails = async (req, res) => {
  const { id } = req.params;
  const { name, owner, email, phone, address, category } = req.body;

  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { name, owner, email, phone, address, category },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Restaurant updated",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all restaurants (Admin)
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete restaurant (Admin)
const deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Restaurant.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  registerRestaurant,
  verifyRestaurant,
  getRestaurantDetails,
  updateRestaurantDetails,
  deleteRestaurant,
  getAllRestaurants,
};
