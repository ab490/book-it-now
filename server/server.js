const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();

app.use(express.json()); 
app.use(cors()); 

// Connecting to MongoDB
mongoose.connect('mongodb+srv://anobajaj:mKKmFb5ISXB6Gmc4@bookitnow.onfe9.mongodb.net/event_booking')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const eventRoutes = require('./routes/event');
const ticketRoutes = require('./routes/ticket');
const userRoutes = require('./routes/user');

// Use routes
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Event Booking API');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
