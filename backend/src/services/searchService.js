import { ProductListing } from '../models/ProductListing.js';
import { CarPart } from '../models/CarPart.js';
import { CarBrand } from '../models/CarBrand.js';
import { CarModel } from '../models/CarModel.js';
import { PartCategory } from '../models/PartCategory.js';
import { query } from '../config/database.js';

export class SearchService {
  // Full-text search across all content
  static async fullTextSearch(searchTerm, options = {}) {
    const {
      page = 1,
      limit = 20,
      entityTypes = ['listings', 'parts'],
      filters = {}
    } = options;

    const results = {
      searchTerm,
      results: [],
      pagination: {
        page,
        limit,
        total: 0
      }
    };

    try {
      // Use PostgreSQL full-text search
      const searchQuery = `
        WITH search_results AS (
          SELECT 
            'listing' as entity_type,
            pl.id,
            pl.name as title,
            pl.description,
            pl.price_usd as price,
            pl.condition,
            pl.location,
            pl.created_date,
            u.first_name,
            u.last_name,
            u.username,
            cp.name as part_name,
            cpc.name as category_name,
            cb.name as brand_name,
            cm.name as model_name,
            ts_rank(
              to_tsvector('english', pl.name || ' ' || COALESCE(pl.description, '')),
              plainto_tsquery('english', $1)
            ) as rank
          FROM product_listings pl
          LEFT JOIN users u ON pl.user_id = u.id
          LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
          LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
          LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
          LEFT JOIN car_models cm ON cp.car_model_id = cm.id
          WHERE pl.status = 'active'
            AND to_tsvector('english', pl.name || ' ' || COALESCE(pl.description, '')) @@ plainto_tsquery('english', $1)
          
          UNION ALL
          
          SELECT 
            'part' as entity_type,
            cp.id,
            cp.name as title,
            cp.description,
            cp.price as price,
            cp.condition,
            NULL as location,
            cp.created_date,
            NULL as first_name,
            NULL as last_name,
            NULL as username,
            cp.name as part_name,
            cpc.name as category_name,
            cb.name as brand_name,
            cm.name as model_name,
            ts_rank(
              to_tsvector('english', cp.name || ' ' || COALESCE(cp.description, '')),
              plainto_tsquery('english', $1)
            ) as rank
          FROM car_parts cp
          LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
          LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
          LEFT JOIN car_models cm ON cp.car_model_id = cm.id
          WHERE to_tsvector('english', cp.name || ' ' || COALESCE(cp.description, '')) @@ plainto_tsquery('english', $1)
        )
        SELECT * FROM search_results
        ORDER BY rank DESC, created_date DESC
        LIMIT $2 OFFSET $3
      `;

      const offset = (page - 1) * limit;
      const searchResult = await query(searchQuery, [searchTerm, limit, offset]);

      // Get total count
      const countQuery = `
        WITH search_results AS (
          SELECT 'listing' as entity_type, pl.id
          FROM product_listings pl
          WHERE pl.status = 'active'
            AND to_tsvector('english', pl.name || ' ' || COALESCE(pl.description, '')) @@ plainto_tsquery('english', $1)
          
          UNION ALL
          
          SELECT 'part' as entity_type, cp.id
          FROM car_parts cp
          WHERE to_tsvector('english', cp.name || ' ' || COALESCE(cp.description, '')) @@ plainto_tsquery('english', $1)
        )
        SELECT COUNT(*) as total FROM search_results
      `;

      const countResult = await query(countQuery, [searchTerm]);
      const total = parseInt(countResult.rows[0].total);

      results.results = searchResult.rows;
      results.pagination.total = total;
      results.pagination.pages = Math.ceil(total / limit);

      return results;
    } catch (error) {
      console.error('Full-text search error:', error);
      throw error;
    }
  }

  // Get search suggestions based on partial input
  static async getSuggestions(partialInput, limit = 10) {
    if (!partialInput || partialInput.length < 2) {
      return [];
    }

    try {
      const suggestions = [];

      // Get brand suggestions
      const brandQuery = `
        SELECT name, 'brand' as type
        FROM car_brands
        WHERE name ILIKE $1
        ORDER BY name
        LIMIT $2
      `;
      const brandResult = await query(brandQuery, [`%${partialInput}%`, Math.ceil(limit / 3)]);
      suggestions.push(...brandResult.rows.map(row => ({ ...row, display: row.name })));

      // Get model suggestions
      const modelQuery = `
        SELECT cm.name, cb.name as brand_name, 'model' as type
        FROM car_models cm
        JOIN car_brands cb ON cm.car_brand_id = cb.id
        WHERE cm.name ILIKE $1
        ORDER BY cb.name, cm.name
        LIMIT $2
      `;
      const modelResult = await query(modelQuery, [`%${partialInput}%`, Math.ceil(limit / 3)]);
      suggestions.push(...modelResult.rows.map(row => ({ 
        ...row, 
        display: `${row.brand_name} ${row.name}` 
      })));

      // Get category suggestions
      const categoryQuery = `
        SELECT name, 'category' as type
        FROM car_parts_categories
        WHERE name ILIKE $1
        ORDER BY name
        LIMIT $2
      `;
      const categoryResult = await query(categoryQuery, [`%${partialInput}%`, Math.ceil(limit / 3)]);
      suggestions.push(...categoryResult.rows.map(row => ({ ...row, display: row.name })));

      return suggestions.slice(0, limit);
    } catch (error) {
      console.error('Search suggestions error:', error);
      return [];
    }
  }

  // Get popular search terms
  static async getPopularSearches(limit = 10) {
    try {
      // This would typically come from a search analytics table
      // For now, return some mock popular searches
      return [
        'brake pads',
        'alternator',
        'headlight',
        'battery',
        'spark plugs',
        'oil filter',
        'air filter',
        'timing belt',
        'water pump',
        'starter motor'
      ].slice(0, limit);
    } catch (error) {
      console.error('Popular searches error:', error);
      return [];
    }
  }

  // Get search filters/options
  static async getSearchFilters() {
    try {
      const [brands, categories, conditions] = await Promise.all([
        CarBrand.findAll(1, 100),
        PartCategory.findAll(1, 100),
        query(`
          SELECT DISTINCT condition, COUNT(*) as count
          FROM product_listings
          WHERE status = 'active' AND condition IS NOT NULL
          GROUP BY condition
          ORDER BY condition
        `)
      ]);

      return {
        brands: brands.map(brand => brand.toJSON()),
        categories: categories.map(category => category.toJSON()),
        conditions: conditions.rows.map(row => ({
          value: row.condition,
          count: parseInt(row.count)
        }))
      };
    } catch (error) {
      console.error('Search filters error:', error);
      return {
        brands: [],
        categories: [],
        conditions: []
      };
    }
  }

  // Search with auto-complete
  static async autoComplete(query, limit = 5) {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const suggestions = await this.getSuggestions(query, limit);
      return suggestions.map(suggestion => ({
        text: suggestion.display,
        type: suggestion.type,
        value: suggestion.name
      }));
    } catch (error) {
      console.error('Auto-complete error:', error);
      return [];
    }
  }
}
