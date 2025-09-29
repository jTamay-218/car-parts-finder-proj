import express from 'express';
import { ProductListing } from '../models/ProductListing.js';
import { User } from '../models/User.js';
import { CarPart } from '../models/CarPart.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Get all listings with filters
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = 'active',
      condition,
      minPrice,
      maxPrice,
      location,
      search,
      brandId,
      modelId,
      categoryId,
      userId
    } = req.query;

    const filters = {
      status,
      condition,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      location,
      searchTerm: search,
      brandId,
      modelId,
      categoryId,
      userId
    };

    let listings;
    if (search) {
      listings = await ProductListing.search(search, filters, parseInt(page), parseInt(limit));
    } else {
      listings = await ProductListing.findAll(filters, parseInt(page), parseInt(limit));
    }

    const totalCount = await ProductListing.getCount(filters);

    res.json({
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get listing by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await ProductListing.findById(id);
    
    if (!listing) {
      return res.status(404).json({
        error: 'Listing not found',
        message: 'The requested listing does not exist'
      });
    }

    res.json({
      listing
    });
  } catch (error) {
    next(error);
  }
});

// Create new listing
router.post('/', authenticateToken, validate(schemas.productListing), async (req, res, next) => {
  try {
    const {
      carPartId,
      name,
      description,
      priceUsd,
      condition,
      location,
      status = 'active',
      phoneNumber,
      email,
      model,
      year
    } = req.body;

    // Verify car part exists if provided
    if (carPartId) {
      const part = await CarPart.findById(carPartId);
      if (!part) {
        return res.status(404).json({
          error: 'Part not found',
          message: 'The specified car part does not exist'
        });
      }
    }

    const listing = await ProductListing.create({
      userId: req.user.id,
      carPartId,
      name,
      description,
      priceUsd,
      condition,
      location,
      status,
      phoneNumber,
      email,
      model,
      year
    });

    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    next(error);
  }
});

// Update listing
router.put('/:id', authenticateToken, validate(schemas.productListing), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const listing = await ProductListing.findById(id);
    if (!listing) {
      return res.status(404).json({
        error: 'Listing not found',
        message: 'The requested listing does not exist'
      });
    }

    // Users can only update their own listings unless they're admin
    if (req.user.id !== listing.userId && !req.user.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own listings'
      });
    }

    // Verify car part exists if being updated
    if (updateData.carPartId) {
      const part = await CarPart.findById(updateData.carPartId);
      if (!part) {
        return res.status(404).json({
          error: 'Part not found',
          message: 'The specified car part does not exist'
        });
      }
    }

    const updatedListing = await listing.update(updateData);

    res.json({
      message: 'Listing updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    next(error);
  }
});

// Delete listing
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const listing = await ProductListing.findById(id);
    if (!listing) {
      return res.status(404).json({
        error: 'Listing not found',
        message: 'The requested listing does not exist'
      });
    }

    // Users can only delete their own listings unless they're admin
    if (req.user.id !== listing.userId && !req.user.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own listings'
      });
    }

    await listing.delete();

    res.json({
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get user's listings
router.get('/user/:userId', optionalAuth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Users can only view their own listings unless they're admin
    if (req.user && req.user.id !== userId && !req.user.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own listings'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    const listings = await ProductListing.findByUserId(userId, parseInt(page), parseInt(limit));
    const totalCount = await ProductListing.getCount({ userId });

    res.json({
      user: user.toJSON(),
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update listing status
router.patch('/:id/status', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'pending', 'sold', 'hidden'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: active, pending, sold, hidden'
      });
    }

    const listing = await ProductListing.findById(id);
    if (!listing) {
      return res.status(404).json({
        error: 'Listing not found',
        message: 'The requested listing does not exist'
      });
    }

    // Users can only update their own listings unless they're admin
    if (req.user.id !== listing.userId && !req.user.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own listings'
      });
    }

    const updatedListing = await listing.update({ status });

    res.json({
      message: 'Listing status updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    next(error);
  }
});

export default router;
