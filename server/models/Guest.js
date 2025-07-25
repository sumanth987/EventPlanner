import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: Number,
  relationship: String,
  dietaryRestrictions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Guest', guestSchema);