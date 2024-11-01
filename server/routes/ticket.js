const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

router.post('/', async (req, res) => {
    const ticketData = req.body;
    console.log("Received ticket booking request:", ticketData);

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const event = await Event.findById(ticketData.event_id).session(session);
            
            if (!event) {
                await session.abortTransaction();
                return res.status(404).json({ message: 'Event not found' });
            }

            if (event.available_tickets < ticketData.number_of_tickets) {
                await session.abortTransaction();
                return res.status(400).json({ 
                    message: `Not enough tickets available. Only ${event.available_tickets} tickets left.` 
                });
            }

            const newTicket = new Ticket(ticketData);
            await newTicket.save({ session });

            // Updating event tickets to be reduced by the number of tickets bought
            event.available_tickets -= ticketData.number_of_tickets;
            await event.save({ session });

            await session.commitTransaction();
            
            res.status(201).json({
                message: 'Booking successful',
                ticket: newTicket,
                remaining_tickets: event.available_tickets
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Booking failed:', error);
        res.status(500).json({ 
            message: 'Booking failed', 
            error: error.message 
        });
    }
});

module.exports = router;
