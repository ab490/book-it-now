const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Add this import
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

router.post('/', async (req, res) => {
    const ticketData = req.body;
    console.log("Received ticket booking request:", ticketData);

    try {
        // Use a database transaction to ensure data consistency
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Find the event and lock it for update
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

            // Create new ticket
            const newTicket = new Ticket(ticketData);
            await newTicket.save({ session });

            // Update event tickets
            event.available_tickets -= ticketData.number_of_tickets;
            await event.save({ session });

            // Commit the transaction
            await session.commitTransaction();
            
            res.status(201).json({
                message: 'Booking successful',
                ticket: newTicket,
                remaining_tickets: event.available_tickets
            });

        } catch (error) {
            // If anything fails, abort the transaction
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
