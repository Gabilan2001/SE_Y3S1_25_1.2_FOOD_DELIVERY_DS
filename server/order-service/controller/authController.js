// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Registration function for Restaurant Service
const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save it to the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login function for Restaurant Service
const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user in the database by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Generate a JWT token for the user, including the userId in the payload
      const token = jwt.sign(
        { userId: user._id, role: user.role },  // Payload includes userId
        process.env.JWT_SECRET,  // Secret key
        { expiresIn: '1h' }  // Token expiration time
      );
  
      // Send the token back to the client
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
  register,
  login,
};
