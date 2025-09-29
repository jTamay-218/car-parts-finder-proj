import express from 'express';
import { PartCategory } from '../models/PartCategory.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Get all part categories
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, withCounts = false } = req.query;
    
    let categories;
    if (withCounts === 'true') {
      categories = await PartCategory.findAllWithCounts(parseInt(page), parseInt(limit));
    } else if (search) {
      categories = await PartCategory.search(search, parseInt(page), parseInt(limit));
    } else {
      categories = await PartCategory.findAll(parseInt(page), parseInt(limit));
    }

    res.json({
      categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get part category by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await PartCategory.findById(id);
    
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'The requested part category does not exist'
      });
    }

    res.json({
      category
    });
  } catch (error) {
    next(error);
  }
});

// Get parts in a specific category
router.get('/:id/parts', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const category = await PartCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'The requested part category does not exist'
      });
    }

    const parts = await category.getParts(parseInt(page), parseInt(limit));
    const partCount = await category.getPartCount();

    res.json({
      category: category,
      parts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: partCount,
        pages: Math.ceil(partCount / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create new part category (admin only)
router.post('/', authenticateToken, requireAdmin, validate(schemas.partCategory), async (req, res, next) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await PartCategory.findByName(name);
    if (existingCategory) {
      return res.status(409).json({
        error: 'Category already exists',
        message: 'A part category with this name already exists'
      });
    }

    const category = await PartCategory.create(name);

    res.status(201).json({
      message: 'Part category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
});

// Update part category (admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(schemas.partCategory), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const category = await PartCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'The requested part category does not exist'
      });
    }

    // Check if new name is already taken by another category
    const existingCategory = await PartCategory.findByName(name);
    if (existingCategory && existingCategory.id !== id) {
      return res.status(409).json({
        error: 'Category name already exists',
        message: 'A part category with this name already exists'
      });
    }

    const updatedCategory = await category.update(name);

    res.json({
      message: 'Part category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    next(error);
  }
});

// Delete part category (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const category = await PartCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'The requested part category does not exist'
      });
    }

    // Check if category has parts
    const partCount = await category.getPartCount();
    
    if (partCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete category',
        message: `Cannot delete category with ${partCount} parts. Please delete associated parts first.`
      });
    }

    await category.delete();

    res.json({
      message: 'Part category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
