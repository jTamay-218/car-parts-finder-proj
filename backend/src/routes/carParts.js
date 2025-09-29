import express from 'express';
import { CarPart } from '../models/CarPart.js';
import { PartCategory } from '../models/PartCategory.js';
import { CarBrand } from '../models/CarBrand.js';
import { CarModel } from '../models/CarModel.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Get all car parts with filters
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      categoryId,
      brandId,
      modelId,
      condition,
      minPrice,
      maxPrice,
      search
    } = req.query;

    const filters = {
      categoryId,
      brandId,
      modelId,
      condition,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      searchTerm: search
    };

    let parts;
    if (search) {
      parts = await CarPart.search(search, filters, parseInt(page), parseInt(limit));
    } else {
      parts = await CarPart.findAll(filters, parseInt(page), parseInt(limit));
    }

    const totalCount = await CarPart.getCount(filters);

    res.json({
      parts,
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

// Get car part by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const part = await CarPart.findById(id);
    
    if (!part) {
      return res.status(404).json({
        error: 'Part not found',
        message: 'The requested car part does not exist'
      });
    }

    res.json({
      part
    });
  } catch (error) {
    next(error);
  }
});

// Get compatible models for a part
router.get('/:id/models', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const part = await CarPart.findById(id);
    
    if (!part) {
      return res.status(404).json({
        error: 'Part not found',
        message: 'The requested car part does not exist'
      });
    }

    const models = await part.getCompatibleModels();

    res.json({
      part: part,
      models
    });
  } catch (error) {
    next(error);
  }
});

// Create new car part (admin only)
router.post('/', authenticateToken, requireAdmin, validate(schemas.carPart), async (req, res, next) => {
  try {
    const {
      name,
      carPartCategoryId,
      serialNumber,
      description,
      price,
      image,
      condition,
      carModelId,
      carBrandId
    } = req.body;

    // Verify category exists
    const category = await PartCategory.findById(carPartCategoryId);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'The specified part category does not exist'
      });
    }

    // Verify brand exists if provided
    if (carBrandId) {
      const brand = await CarBrand.findById(carBrandId);
      if (!brand) {
        return res.status(404).json({
          error: 'Brand not found',
          message: 'The specified car brand does not exist'
        });
      }
    }

    // Verify model exists if provided
    if (carModelId) {
      const model = await CarModel.findById(carModelId);
      if (!model) {
        return res.status(404).json({
          error: 'Model not found',
          message: 'The specified car model does not exist'
        });
      }
    }

    const part = await CarPart.create({
      name,
      carPartCategoryId,
      serialNumber,
      description,
      price,
      image,
      condition,
      carModelId,
      carBrandId
    });

    res.status(201).json({
      message: 'Car part created successfully',
      part
    });
  } catch (error) {
    next(error);
  }
});

// Update car part (admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(schemas.carPart), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const part = await CarPart.findById(id);
    if (!part) {
      return res.status(404).json({
        error: 'Part not found',
        message: 'The requested car part does not exist'
      });
    }

    // Verify category exists if being updated
    if (updateData.carPartCategoryId) {
      const category = await PartCategory.findById(updateData.carPartCategoryId);
      if (!category) {
        return res.status(404).json({
          error: 'Category not found',
          message: 'The specified part category does not exist'
        });
      }
    }

    // Verify brand exists if being updated
    if (updateData.carBrandId) {
      const brand = await CarBrand.findById(updateData.carBrandId);
      if (!brand) {
        return res.status(404).json({
          error: 'Brand not found',
          message: 'The specified car brand does not exist'
        });
      }
    }

    // Verify model exists if being updated
    if (updateData.carModelId) {
      const model = await CarModel.findById(updateData.carModelId);
      if (!model) {
        return res.status(404).json({
          error: 'Model not found',
          message: 'The specified car model does not exist'
        });
      }
    }

    const updatedPart = await part.update(updateData);

    res.json({
      message: 'Car part updated successfully',
      part: updatedPart
    });
  } catch (error) {
    next(error);
  }
});

// Add compatibility between part and model (admin only)
router.post('/:id/compatibility', authenticateToken, requireAdmin, validate(schemas.compatibility, 'body'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { carModelId } = req.body;
    
    const part = await CarPart.findById(id);
    if (!part) {
      return res.status(404).json({
        error: 'Part not found',
        message: 'The requested car part does not exist'
      });
    }

    const model = await CarModel.findById(carModelId);
    if (!model) {
      return res.status(404).json({
        error: 'Model not found',
        message: 'The specified car model does not exist'
      });
    }

    const compatibility = await part.addCompatibility(carModelId);

    res.status(201).json({
      message: 'Compatibility added successfully',
      compatibility
    });
  } catch (error) {
    next(error);
  }
});

// Remove compatibility between part and model (admin only)
router.delete('/:id/compatibility/:modelId', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id, modelId } = req.params;
    
    const part = await CarPart.findById(id);
    if (!part) {
      return res.status(404).json({
        error: 'Part not found',
        message: 'The requested car part does not exist'
      });
    }

    await part.removeCompatibility(modelId);

    res.json({
      message: 'Compatibility removed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete car part (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const part = await CarPart.findById(id);
    if (!part) {
      return res.status(404).json({
        error: 'Part not found',
        message: 'The requested car part does not exist'
      });
    }

    await part.delete();

    res.json({
      message: 'Car part deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
