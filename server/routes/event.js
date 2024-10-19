const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create event (POST request)
router.post('/', async (req, res) => {
  const eventData = req.body;
  const newEvent = new Event(eventData);
  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: 'Event creation failed', error });
  }
});

// Get all events (GET request)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ message: 'Fetching events failed', error });
  }
});

module.exports = router;
