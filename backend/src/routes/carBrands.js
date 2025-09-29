import express from 'express';
import { CarBrand } from '../models/CarBrand.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Get all car brands
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    
    let brands;
    if (search) {
      brands = await CarBrand.search(search, parseInt(page), parseInt(limit));
    } else {
      brands = await CarBrand.findAll(parseInt(page), parseInt(limit));
    }

    res.json({
      brands,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get car brand by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await CarBrand.findById(id);
    
    if (!brand) {
      return res.status(404).json({
        error: 'Brand not found',
        message: 'The requested car brand does not exist'
      });
    }

    res.json({
      brand
    });
  } catch (error) {
    next(error);
  }
});

// Get models for a specific brand
router.get('/:id/models', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const brand = await CarBrand.findById(id);
    if (!brand) {
      return res.status(404).json({
        error: 'Brand not found',
        message: 'The requested car brand does not exist'
      });
    }

    const models = await brand.getModels(parseInt(page), parseInt(limit));
    const modelCount = await brand.getModelCount();

    res.json({
      brand: brand,
      models,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: modelCount,
        pages: Math.ceil(modelCount / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get parts for a specific brand
router.get('/:id/parts', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const brand = await CarBrand.findById(id);
    if (!brand) {
      return res.status(404).json({
        error: 'Brand not found',
        message: 'The requested car brand does not exist'
      });
    }

    const parts = await brand.getParts(parseInt(page), parseInt(limit));
    const partCount = await brand.getPartCount();

    res.json({
      brand: brand,
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

// Create new car brand (admin only)
router.post('/', authenticateToken, requireAdmin, validate(schemas.carBrand), async (req, res, next) => {
  try {
    const { name } = req.body;

    // Check if brand already exists
    const existingBrand = await CarBrand.findByName(name);
    if (existingBrand) {
      return res.status(409).json({
        error: 'Brand already exists',
        message: 'A car brand with this name already exists'
      });
    }

    const brand = await CarBrand.create(name);

    res.status(201).json({
      message: 'Car brand created successfully',
      brand
    });
  } catch (error) {
    next(error);
  }
});

// Update car brand (admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(schemas.carBrand), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const brand = await CarBrand.findById(id);
    if (!brand) {
      return res.status(404).json({
        error: 'Brand not found',
        message: 'The requested car brand does not exist'
      });
    }

    // Check if new name is already taken by another brand
    const existingBrand = await CarBrand.findByName(name);
    if (existingBrand && existingBrand.id !== id) {
      return res.status(409).json({
        error: 'Brand name already exists',
        message: 'A car brand with this name already exists'
      });
    }

    const updatedBrand = await brand.update(name);

    res.json({
      message: 'Car brand updated successfully',
      brand: updatedBrand
    });
  } catch (error) {
    next(error);
  }
});

// Delete car brand (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const brand = await CarBrand.findById(id);
    if (!brand) {
      return res.status(404).json({
        error: 'Brand not found',
        message: 'The requested car brand does not exist'
      });
    }

    // Check if brand has models or parts
    const modelCount = await brand.getModelCount();
    const partCount = await brand.getPartCount();
    
    if (modelCount > 0 || partCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete brand',
        message: `Cannot delete brand with ${modelCount} models and ${partCount} parts. Please delete associated models and parts first.`
      });
    }

    await brand.delete();

    res.json({
      message: 'Car brand deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
