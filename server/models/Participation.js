import mongoose from 'mongoose';

const participationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  miniEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MiniEvent',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'completed', 'cancelled'],
    default: 'registered'
  },
  score: Number,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Participation', participationSchema);