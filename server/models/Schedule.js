import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
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
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: String,
  type: {
    type: String,
    enum: ['ceremony', 'reception', 'activity', 'meal', 'other'],
    default: 'other'
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Schedule', scheduleSchema);