import mongoose from 'mongoose';

const miniEventSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['game', 'activity', 'contest', 'photo', 'other'],
    default: 'activity'
  },
  maxParticipants: {
    type: Number,
    default: 50
  },
  startTime: Date,
  endTime: Date,
  location: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('MiniEvent', miniEventSchema);