import express from 'express';
import Guest from '../models/Guest.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's guests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const guests = await Guest.find({ userId: req.user._id }).select('-__v');
    res.json(guests);
  } catch (error) {
    console.error('Get guests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add guest
router.post('/', authenticateToken, async (req, res) => {
  try {
    const guest = new Guest({
      ...req.body,
      userId: req.user._id
    });
    
    await guest.save();
    res.status(201).json(guest);
  } catch (error) {
    console.error('Add guest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update guest
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const guest = await Guest.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    
    res.json(guest);
  } catch (error) {
    console.error('Update guest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete guest
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const guest = await Guest.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Delete guest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;