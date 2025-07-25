import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'guest'],
    default: 'guest'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rsvpStatus: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  travelDetails: {
    arrivalDate: Date,
    departureDate: Date,
    flightNumber: String,
    accommodation: String
  },
  dietaryRestrictions: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);