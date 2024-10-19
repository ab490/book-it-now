const mongoose = require('mongoose');

// Define event schema
const EventSchema = new mongoose.Schema({
  event_name: { type: String, required: true },
  date: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  location: { type: String, required: true },
  ticket_type: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  available_tickets: { type: Number, required: true },
  organizer_name: { type: String, required: true },
  organizer_email: { type: String, required: true }
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
