import express from 'express';
import MiniEvent from '../models/MiniEvent.js';
import Participation from '../models/Participation.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get mini events
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.query;
    const query = eventId ? { eventId, isActive: true } : { isActive: true };
    
    const miniEvents = await MiniEvent.find(query)
      .populate('eventId', 'title')
      .select('-__v');
    
    res.json(miniEvents);
  } catch (error) {
    console.error('Get mini events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join mini event
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const miniEventId = req.params.id;
    const userId = req.user._id;
    
    // Check if already participating
    const existing = await Participation.findOne({ userId, miniEventId });
    if (existing) {
      return res.status(400).json({ error: 'Already participating in this event' });
    }
    
    const participation = new Participation({
      userId,
      miniEventId,
      status: 'registered'
    });
    
    await participation.save();
    res.status(201).json(participation);
  } catch (error) {
    console.error('Join mini event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user participations
router.get('/my-participations', authenticateToken, async (req, res) => {
  try {
    const participations = await Participation.find({ userId: req.user._id })
      .populate('miniEventId')
      .select('-__v');
    
    res.json(participations);
  } catch (error) {
    console.error('Get participations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;