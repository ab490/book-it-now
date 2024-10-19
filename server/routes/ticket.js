const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

// Book a ticket (POST request)
router.post('/', async (req, res) => {
  const ticketData = req.body;
  const newTicket = new Ticket(ticketData);
  try {
    // Find the event by ID and decrease available tickets
    const event = await Event.findById(ticketData.event_id);
    if (event.available_tickets >= ticketData.number_of_tickets) {
      event.available_tickets -= ticketData.number_of_tickets;
      await event.save();  // Update the event

      await newTicket.save();  // Save the ticket booking
      res.status(201).json(newTicket);
    } else {
      res.status(400).json({ message: 'Not enough tickets available' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Booking failed', error });
  }
});

module.exports = router;
