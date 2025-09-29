import express from 'express';
import { User } from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.findAll(parseInt(page), parseInt(limit));
    
    res.json({
      users: users.map(user => user.toJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    // Users can only view their own profile unless they're admin
    if (req.user.id !== id && !req.user.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own profile'
      });
    }

    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/:id', authenticateToken, validate(schemas.userUpdate), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    // Users can only update their own profile unless they're admin
    if (req.user.id !== id && !req.user.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own profile'
      });
    }

    // Check if email is already taken by another user
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findByEmail(req.body.email);
      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({
          error: 'Email already taken',
          message: 'This email is already registered to another account'
        });
      }
    }

    // Check if username is already taken by another user
    if (req.body.username && req.body.username !== user.username) {
      const existingUser = await User.findByUsername(req.body.username);
      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({
          error: 'Username already taken',
          message: 'This username is already taken by another user'
        });
      }
    }

    const updatedUser = await user.update(req.body);

    res.json({
      message: 'User updated successfully',
      user: updatedUser.toJSON()
    });
  } catch (error) {
    next(error);
  }
});

// Update user password
router.put('/:id/password', authenticateToken, validate(schemas.passwordUpdate), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    // Users can only update their own password unless they're admin
    if (req.user.id !== id && !req.user.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own password'
      });
    }

    // Verify current password (unless admin is updating for another user)
    if (req.user.id === id) {
      const isValidPassword = await user.verifyPassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({
          error: 'Invalid current password',
          message: 'The current password is incorrect'
        });
      }
    }

    await user.updatePassword(newPassword);

    res.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get user's listings
router.get('/:id/listings', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Users can only view their own listings unless they're admin
    if (req.user.id !== id && !req.user.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own listings'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    const listings = await user.getListings(parseInt(page), parseInt(limit));
    const listingCount = await user.getListingCount();

    res.json({
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: listingCount,
        pages: Math.ceil(listingCount / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({
        error: 'Cannot delete self',
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    await user.delete();

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
