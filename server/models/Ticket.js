// tickets collection in MongoDB
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  attendee_name: { type: String, required: true },
  attendee_email: { type: String, required: true },
  number_of_tickets: { type: Number, required: true }},
  { versionKey: false });

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
