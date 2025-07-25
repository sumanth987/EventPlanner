import express from 'express';
import User from '../models/User.js';
import Guest from '../models/Guest.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    const guests = await Guest.find({ userId: req.user._id });
    
    res.json({
      ...user.toObject(),
      guests
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    delete updates._id; // Prevent ID modification
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify user (admin only)
router.put('/:id/verify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-__v');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get RSVP statistics
router.get('/rsvp-stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$rsvpStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const result = {
      pending: 0,
      accepted: 0,
      declined: 0
    };
    
    stats.forEach(stat => {
      result[stat._id] = stat.count;
    });
    
    res.json(result);
  } catch (error) {
    console.error('RSVP stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;