import express from 'express';
import { ProductListing } from '../models/ProductListing.js';
import { CarPart } from '../models/CarPart.js';
import { CarBrand } from '../models/CarBrand.js';
import { CarModel } from '../models/CarModel.js';
import { PartCategory } from '../models/PartCategory.js';
import { optionalAuth } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Global search across all entities
router.get('/', optionalAuth, validate(schemas.search, 'query'), async (req, res, next) => {
  try {
    const {
      q: searchTerm,
      page = 1,
      limit = 20,
      type = 'all', // all, listings, parts, brands, models, categories
      ...filters
    } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        error: 'Search term required',
        message: 'Please provide a search term'
      });
    }

    const results = {
      searchTerm,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    };

    // Search based on type
    switch (type) {
      case 'listings':
        const listings = await ProductListing.search(searchTerm, filters, parseInt(page), parseInt(limit));
        const listingCount = await ProductListing.getCount({ ...filters, searchTerm });
        results.listings = listings;
        results.pagination.total = listingCount;
        results.pagination.pages = Math.ceil(listingCount / parseInt(limit));
        break;

      case 'parts':
        const parts = await CarPart.search(searchTerm, filters, parseInt(page), parseInt(limit));
        const partCount = await CarPart.getCount({ ...filters, searchTerm });
        results.parts = parts;
        results.pagination.total = partCount;
        results.pagination.pages = Math.ceil(partCount / parseInt(limit));
        break;

      case 'brands':
        const brands = await CarBrand.search(searchTerm, parseInt(page), parseInt(limit));
        results.brands = brands;
        break;

      case 'models':
        const models = await CarModel.search(searchTerm, filters.brandId, parseInt(page), parseInt(limit));
        results.models = models;
        break;

      case 'categories':
        const categories = await PartCategory.search(searchTerm, parseInt(page), parseInt(limit));
        results.categories = categories;
        break;

      case 'all':
      default:
        // Search all entities
        const [allListings, allParts, allBrands, allModels, allCategories] = await Promise.all([
          ProductListing.search(searchTerm, filters, parseInt(page), parseInt(limit)),
          CarPart.search(searchTerm, filters, parseInt(page), parseInt(limit)),
          CarBrand.search(searchTerm, 1, 5), // Limit to 5 for suggestions
          CarModel.search(searchTerm, filters.brandId, 1, 5), // Limit to 5 for suggestions
          PartCategory.search(searchTerm, 1, 5) // Limit to 5 for suggestions
        ]);

        const [allListingCount, allPartCount] = await Promise.all([
          ProductListing.getCount({ ...filters, searchTerm }),
          CarPart.getCount({ ...filters, searchTerm })
        ]);

        results.listings = allListings;
        results.parts = allParts;
        results.brands = allBrands;
        results.models = allModels;
        results.categories = allCategories;
        results.pagination.total = allListingCount + allPartCount;
        results.pagination.pages = Math.ceil(Math.max(allListingCount, allPartCount) / parseInt(limit));
        break;
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
});

// Search suggestions/autocomplete
router.get('/suggestions', optionalAuth, async (req, res, next) => {
  try {
    const { q: searchTerm, type = 'all' } = req.query;

    if (!searchTerm || searchTerm.length < 2) {
      return res.json({
        suggestions: []
      });
    }

    const suggestions = [];

    switch (type) {
      case 'brands':
        const brands = await CarBrand.search(searchTerm, 1, 10);
        suggestions.push(...brands.map(brand => ({
          type: 'brand',
          id: brand.id,
          name: brand.name,
          display: brand.name
        })));
        break;

      case 'models':
        const models = await CarModel.search(searchTerm, null, 1, 10);
        suggestions.push(...models.map(model => ({
          type: 'model',
          id: model.id,
          name: model.name,
          brand: model.brand_name,
          display: `${model.brand_name} ${model.name}`
        })));
        break;

      case 'categories':
        const categories = await PartCategory.search(searchTerm, 1, 10);
        suggestions.push(...categories.map(category => ({
          type: 'category',
          id: category.id,
          name: category.name,
          display: category.name
        })));
        break;

      case 'all':
      default:
        // Get suggestions from all entities
        const [suggestBrands, suggestModels, suggestCategories] = await Promise.all([
          CarBrand.search(searchTerm, 1, 5),
          CarModel.search(searchTerm, null, 1, 5),
          PartCategory.search(searchTerm, 1, 5)
        ]);

        suggestions.push(
          ...suggestBrands.map(brand => ({
            type: 'brand',
            id: brand.id,
            name: brand.name,
            display: brand.name
          })),
          ...suggestModels.map(model => ({
            type: 'model',
            id: model.id,
            name: model.name,
            brand: model.brand_name,
            display: `${model.brand_name} ${model.name}`
          })),
          ...suggestCategories.map(category => ({
            type: 'category',
            id: category.id,
            name: category.name,
            display: category.name
          }))
        );
        break;
    }

    res.json({
      suggestions: suggestions.slice(0, 10) // Limit to 10 total suggestions
    });
  } catch (error) {
    next(error);
  }
});

// Advanced search with multiple filters
router.post('/advanced', optionalAuth, async (req, res, next) => {
  try {
    const {
      searchTerm,
      page = 1,
      limit = 20,
      filters = {},
      sortBy = 'created_date',
      sortOrder = 'desc'
    } = req.body;

    // Validate sort parameters
    const validSortFields = ['created_date', 'price_usd', 'name', 'condition'];
    const validSortOrders = ['asc', 'desc'];

    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: 'Invalid sort field',
        message: `Sort field must be one of: ${validSortFields.join(', ')}`
      });
    }

    if (!validSortOrders.includes(sortOrder)) {
      return res.status(400).json({
        error: 'Invalid sort order',
        message: 'Sort order must be either "asc" or "desc"'
      });
    }

    // Build search query with sorting
    let queryText = `
      SELECT pl.*, u.first_name, u.last_name, u.username,
             cp.name as part_name, cp.image as part_image, cp.serial_number,
             cpc.name as category_name, cb.name as brand_name, cm.name as model_name
      FROM product_listings pl
      LEFT JOIN users u ON pl.user_id = u.id
      LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
      LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
      LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
      LEFT JOIN car_models cm ON cp.car_model_id = cm.id
      WHERE pl.status = 'active'
    `;

    const params = [];
    let paramCount = 1;

    // Add search term filter
    if (searchTerm) {
      queryText += ` AND (pl.name ILIKE $${paramCount} OR pl.description ILIKE $${paramCount})`;
      params.push(`%${searchTerm}%`);
      paramCount++;
    }

    // Add other filters
    if (filters.condition) {
      queryText += ` AND pl.condition = $${paramCount}`;
      params.push(filters.condition);
      paramCount++;
    }

    if (filters.minPrice !== undefined) {
      queryText += ` AND pl.price_usd >= $${paramCount}`;
      params.push(filters.minPrice);
      paramCount++;
    }

    if (filters.maxPrice !== undefined) {
      queryText += ` AND pl.price_usd <= $${paramCount}`;
      params.push(filters.maxPrice);
      paramCount++;
    }

    if (filters.location) {
      queryText += ` AND pl.location ILIKE $${paramCount}`;
      params.push(`%${filters.location}%`);
      paramCount++;
    }

    if (filters.brandId) {
      queryText += ` AND cb.id = $${paramCount}`;
      params.push(filters.brandId);
      paramCount++;
    }

    if (filters.modelId) {
      queryText += ` AND cm.id = $${paramCount}`;
      params.push(filters.modelId);
      paramCount++;
    }

    if (filters.categoryId) {
      queryText += ` AND cpc.id = $${paramCount}`;
      params.push(filters.categoryId);
      paramCount++;
    }

    // Add sorting
    queryText += ` ORDER BY pl.${sortBy} ${sortOrder.toUpperCase()}`;

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    queryText += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const { query } = await import('../config/database.js');
    const result = await query(queryText, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as count
      FROM product_listings pl
      LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
      LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
      LEFT JOIN car_models cm ON cp.car_model_id = cm.id
      LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
      WHERE pl.status = 'active'
    `;

    const countParams = [];
    let countParamCount = 1;

    if (searchTerm) {
      countQuery += ` AND (pl.name ILIKE $${countParamCount} OR pl.description ILIKE $${countParamCount})`;
      countParams.push(`%${searchTerm}%`);
      countParamCount++;
    }

    // Add same filters to count query
    if (filters.condition) {
      countQuery += ` AND pl.condition = $${countParamCount}`;
      countParams.push(filters.condition);
      countParamCount++;
    }

    if (filters.minPrice !== undefined) {
      countQuery += ` AND pl.price_usd >= $${countParamCount}`;
      countParams.push(filters.minPrice);
      countParamCount++;
    }

    if (filters.maxPrice !== undefined) {
      countQuery += ` AND pl.price_usd <= $${countParamCount}`;
      countParams.push(filters.maxPrice);
      countParamCount++;
    }

    if (filters.location) {
      countQuery += ` AND pl.location ILIKE $${countParamCount}`;
      countParams.push(`%${filters.location}%`);
      countParamCount++;
    }

    if (filters.brandId) {
      countQuery += ` AND cb.id = $${countParamCount}`;
      countParams.push(filters.brandId);
      countParamCount++;
    }

    if (filters.modelId) {
      countQuery += ` AND cm.id = $${countParamCount}`;
      countParams.push(filters.modelId);
      countParamCount++;
    }

    if (filters.categoryId) {
      countQuery += ` AND cpc.id = $${countParamCount}`;
      countParams.push(filters.categoryId);
      countParamCount++;
    }

    const countResult = await query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      listings: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      },
      filters: filters,
      sortBy: sortBy,
      sortOrder: sortOrder
    });
  } catch (error) {
    next(error);
  }
});

export default router;
