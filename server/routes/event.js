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

// Get a single event by ID (GET request)
router.get('/:eventId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId); // Retrieve event by ID
    if (event) {
      res.status(200).json(event);  // Return event if found
    } else {
      res.status(404).json({ message: 'Event not found' });  // If no event found, return 404
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
