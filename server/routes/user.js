const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sign-Up Route
router.post('/signup', async (req, res) => {
  const { email, password, userType } = req.body;
  
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create a new user
    const newUser = new User({ email, password, userType });
    await newUser.save();
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed', error });
  }
});

// Sign-In Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Return user details upon successful login
    res.status(200).json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error });
  }
});

module.exports = router;
