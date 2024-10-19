const mongoose = require('mongoose');

// Define ticket schema
const TicketSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  attendee_name: { type: String, required: true },
  attendee_email: { type: String, required: true },
  number_of_tickets: { type: Number, required: true },
  booking_date: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
