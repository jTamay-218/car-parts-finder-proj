import express from 'express';
import { CarModel } from '../models/CarModel.js';
import { CarBrand } from '../models/CarBrand.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Get all car models
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, brandId } = req.query;
    
    let models;
    if (search) {
      models = await CarModel.search(search, brandId, parseInt(page), parseInt(limit));
    } else {
      models = await CarModel.findAll(parseInt(page), parseInt(limit));
    }

    res.json({
      models,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get car model by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const model = await CarModel.findById(id);
    
    if (!model) {
      return res.status(404).json({
        error: 'Model not found',
        message: 'The requested car model does not exist'
      });
    }

    res.json({
      model
    });
  } catch (error) {
    next(error);
  }
});

// Get compatible parts for a specific model
router.get('/:id/parts', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const model = await CarModel.findById(id);
    if (!model) {
      return res.status(404).json({
        error: 'Model not found',
        message: 'The requested car model does not exist'
      });
    }

    const parts = await model.getCompatibleParts(parseInt(page), parseInt(limit));
    const partCount = await model.getPartCount();

    res.json({
      model: model,
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

// Create new car model (admin only)
router.post('/', authenticateToken, requireAdmin, validate(schemas.carModel), async (req, res, next) => {
  try {
    const { name, carBrandId, yearsStart, yearsEnd } = req.body;

    // Verify brand exists
    const brand = await CarBrand.findById(carBrandId);
    if (!brand) {
      return res.status(404).json({
        error: 'Brand not found',
        message: 'The specified car brand does not exist'
      });
    }

    // Check if model already exists for this brand
    const existingModel = await CarModel.search(name, carBrandId, 1, 1);
    if (existingModel.length > 0) {
      return res.status(409).json({
        error: 'Model already exists',
        message: 'A car model with this name already exists for this brand'
      });
    }

    const model = await CarModel.create({
      name,
      carBrandId,
      yearsStart,
      yearsEnd
    });

    res.status(201).json({
      message: 'Car model created successfully',
      model
    });
  } catch (error) {
    next(error);
  }
});

// Update car model (admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(schemas.carModel), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, yearsStart, yearsEnd } = req.body;
    
    const model = await CarModel.findById(id);
    if (!model) {
      return res.status(404).json({
        error: 'Model not found',
        message: 'The requested car model does not exist'
      });
    }

    // Check if new name is already taken by another model for the same brand
    const existingModel = await CarModel.search(name, model.carBrandId, 1, 1);
    if (existingModel.length > 0 && existingModel[0].id !== id) {
      return res.status(409).json({
        error: 'Model name already exists',
        message: 'A car model with this name already exists for this brand'
      });
    }

    const updatedModel = await model.update({
      name,
      yearsStart,
      yearsEnd
    });

    res.json({
      message: 'Car model updated successfully',
      model: updatedModel
    });
  } catch (error) {
    next(error);
  }
});

// Delete car model (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const model = await CarModel.findById(id);
    if (!model) {
      return res.status(404).json({
        error: 'Model not found',
        message: 'The requested car model does not exist'
      });
    }

    // Check if model has parts
    const partCount = await model.getPartCount();
    
    if (partCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete model',
        message: `Cannot delete model with ${partCount} parts. Please delete associated parts first.`
      });
    }

    await model.delete();

    res.json({
      message: 'Car model deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
