// To define the structures of different documents in MongoDB
const eventSchema = new mongoose.Schema({
  event_name: { type: String, required: true },
  date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  location: { type: String, required: true },
  ticket_type: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  available_tickets: { type: Number, required: true }
});

const Event = mongoose.model('Event', eventSchema);

const bookingSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  number_of_tickets: { type: Number, required: true },
  booking_date: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);
