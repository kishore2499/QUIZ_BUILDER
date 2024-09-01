const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// User Registration Endpoint
router.post("/signup", async (req, res) => {
  //console.log("Received request body:", req.body);
  const { username, email, password } = req.body;

  // Ensure all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Please provide all required fields" });
  }

  try {
    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Create and save new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "An error occurred", details: error.message });
  }
});

// User Login Endpoint
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "An error occurred", details: error.message });
  }
});

module.exports = router;






