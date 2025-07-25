import express from 'express';
import Schedule from '../models/Schedule.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get schedule items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.query;
    const query = eventId ? { eventId } : {};
    
    const scheduleItems = await Schedule.find(query)
      .populate('eventId', 'title')
      .sort({ startTime: 1 })
      .select('-__v');
    
    res.json(scheduleItems);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create schedule item (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const scheduleItem = new Schedule(req.body);
    await scheduleItem.save();
    await scheduleItem.populate('eventId', 'title');
    res.status(201).json(scheduleItem);
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update schedule item (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const scheduleItem = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('eventId', 'title').select('-__v');
    
    if (!scheduleItem) {
      return res.status(404).json({ error: 'Schedule item not found' });
    }
    
    res.json(scheduleItem);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete schedule item (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const scheduleItem = await Schedule.findByIdAndDelete(req.params.id);
    
    if (!scheduleItem) {
      return res.status(404).json({ error: 'Schedule item not found' });
    }
    
    res.json({ message: 'Schedule item deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;