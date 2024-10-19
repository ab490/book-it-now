const mongoose = require('mongoose');

// Define user schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email is unique
  password: { type: String, required: true },
  userType: { type: String, enum: ['organizer', 'attendee'], required: true } // Organizer or attendee
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
