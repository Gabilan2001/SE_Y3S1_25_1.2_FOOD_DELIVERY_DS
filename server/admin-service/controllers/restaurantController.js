import nodemailer from "nodemailer";
import Restaurant from "../models/restaurantModel.js";

// Configure Nodemailer Transporter (Using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rashadfaris4675@gmail.com", 
    pass: "dxtu yugd wgei apvr", 
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
      name,
      owner,
      email,
      phone,
      address,
      category,
    });

    await newRestaurant.save();

    // Send Registration Email
    const mailOptions = {
      from: "rashadfaris4675@gmail.com", // Sender's email
      to: email, // Recipient's email (restaurant's email)
      subject: "Restaurant Registration Successful",
      html: `
        <h2>Welcome to Our Platform, ${name}!</h2>
        <p>Dear ${owner},</p>
        <p>Your restaurant <strong>${name}</strong> has been successfully registered.</p>
        <p>We are excited to have you on board!</p>
        <p>Best Regards,</p>
        <p>Food Delivery Team</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant: newRestaurant,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch details of a restaurant by ID (Admin)
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
  
 // Update restaurant details (Admin)
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
  
      res.status(200).json({ message: "Restaurant details updated successfully", restaurant: updatedRestaurant });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete a restaurant (Admin)
const deleteRestaurant = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
  
      if (!deletedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      res.status(200).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  

  
  export {
    registerRestaurant,
    getRestaurantDetails,
    updateRestaurantDetails,
    deleteRestaurant
  };
  