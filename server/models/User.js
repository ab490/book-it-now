const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true }, 
  password: { type: String, required: true },
  phone: {type: String, required: true },
  userType: { type: String, enum: ['organizer', 'attendee'], required: true }},
  { versionKey: false });

const User = mongoose.model('User', UserSchema);
module.exports = User;
