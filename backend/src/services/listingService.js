import { ProductListing } from '../models/ProductListing.js';
import { User } from '../models/User.js';
import { CarPart } from '../models/CarPart.js';
import { query } from '../config/database.js';

export class ListingService {
  // Get featured listings (most recent, best condition, etc.)
  static async getFeaturedListings(limit = 10) {
    try {
      const featuredQuery = `
        SELECT pl.*, u.first_name, u.last_name, u.username,
               cp.name as part_name, cp.image as part_image,
               cpc.name as category_name, cb.name as brand_name, cm.name as model_name,
               CASE 
                 WHEN pl.condition = 'new' THEN 5
                 WHEN pl.condition = 'like_new' THEN 4
                 WHEN pl.condition = 'good' THEN 3
                 WHEN pl.condition = 'fair' THEN 2
                 WHEN pl.condition = 'poor' THEN 1
                 ELSE 0
               END as condition_score
        FROM product_listings pl
        LEFT JOIN users u ON pl.user_id = u.id
        LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
        LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
        LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
        LEFT JOIN car_models cm ON cp.car_model_id = cm.id
        WHERE pl.status = 'active'
        ORDER BY condition_score DESC, pl.created_date DESC
        LIMIT $1
      `;

      const result = await query(featuredQuery, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Featured listings error:', error);
      throw error;
    }
  }

  // Get listings by location
  static async getListingsByLocation(location, limit = 20) {
    try {
      const locationQuery = `
        SELECT pl.*, u.first_name, u.last_name, u.username,
               cp.name as part_name, cp.image as part_image,
               cpc.name as category_name, cb.name as brand_name, cm.name as model_name
        FROM product_listings pl
        LEFT JOIN users u ON pl.user_id = u.id
        LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
        LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
        LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
        LEFT JOIN car_models cm ON cp.car_model_id = cm.id
        WHERE pl.status = 'active' AND pl.location ILIKE $1
        ORDER BY pl.created_date DESC
        LIMIT $2
      `;

      const result = await query(locationQuery, [`%${location}%`, limit]);
      return result.rows;
    } catch (error) {
      console.error('Location listings error:', error);
      throw error;
    }
  }

  // Get similar listings based on part or category
  static async getSimilarListings(listingId, limit = 5) {
    try {
      const similarQuery = `
        WITH target_listing AS (
          SELECT pl.car_part_id, pl.condition, cpc.id as category_id
          FROM product_listings pl
          LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
          LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
          WHERE pl.id = $1
        )
        SELECT pl.*, u.first_name, u.last_name, u.username,
               cp.name as part_name, cp.image as part_image,
               cpc.name as category_name, cb.name as brand_name, cm.name as model_name
        FROM product_listings pl
        LEFT JOIN users u ON pl.user_id = u.id
        LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
        LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
        LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
        LEFT JOIN car_models cm ON cp.car_model_id = cm.id
        CROSS JOIN target_listing tl
        WHERE pl.status = 'active' 
          AND pl.id != $1
          AND (
            pl.car_part_id = tl.car_part_id 
            OR cpc.id = tl.category_id
            OR pl.condition = tl.condition
          )
        ORDER BY 
          CASE WHEN pl.car_part_id = tl.car_part_id THEN 1 ELSE 2 END,
          pl.created_date DESC
        LIMIT $2
      `;

      const result = await query(similarQuery, [listingId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Similar listings error:', error);
      throw error;
    }
  }

  // Get listing statistics
  static async getListingStats() {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_listings,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_listings,
          COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_listings,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_listings,
          AVG(price_usd) as avg_price,
          MIN(price_usd) as min_price,
          MAX(price_usd) as max_price,
          COUNT(DISTINCT user_id) as unique_sellers
        FROM product_listings
        WHERE created_date >= NOW() - INTERVAL '30 days'
      `;

      const result = await query(statsQuery);
      return result.rows[0];
    } catch (error) {
      console.error('Listing stats error:', error);
      throw error;
    }
  }

  // Get user's listing performance
  static async getUserListingStats(userId) {
    try {
      const userStatsQuery = `
        SELECT 
          COUNT(*) as total_listings,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_listings,
          COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_listings,
          AVG(price_usd) as avg_price,
          SUM(price_usd) as total_value,
          MIN(created_date) as first_listing_date,
          MAX(created_date) as last_listing_date
        FROM product_listings
        WHERE user_id = $1
      `;

      const result = await query(userStatsQuery, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('User listing stats error:', error);
      throw error;
    }
  }

  // Mark listing as sold
  static async markAsSold(listingId, userId) {
    try {
      const listing = await ProductListing.findById(listingId);
      if (!listing) {
        throw new Error('Listing not found');
      }

      if (listing.userId !== userId) {
        throw new Error('Unauthorized to update this listing');
      }

      const updatedListing = await listing.update({ status: 'sold' });
      return updatedListing;
    } catch (error) {
      console.error('Mark as sold error:', error);
      throw error;
    }
  }

  // Renew listing (reset created_date for better visibility)
  static async renewListing(listingId, userId) {
    try {
      const listing = await ProductListing.findById(listingId);
      if (!listing) {
        throw new Error('Listing not found');
      }

      if (listing.userId !== userId) {
        throw new Error('Unauthorized to update this listing');
      }

      if (listing.status !== 'active') {
        throw new Error('Only active listings can be renewed');
      }

      // Update the created_date to current timestamp
      const renewQuery = `
        UPDATE product_listings 
        SET created_date = NOW() 
        WHERE id = $1 
        RETURNING *
      `;

      const result = await query(renewQuery, [listingId]);
      return new ProductListing(result.rows[0]);
    } catch (error) {
      console.error('Renew listing error:', error);
      throw error;
    }
  }

  // Get listings by price range
  static async getListingsByPriceRange(minPrice, maxPrice, limit = 20) {
    try {
      const priceQuery = `
        SELECT pl.*, u.first_name, u.last_name, u.username,
               cp.name as part_name, cp.image as part_image,
               cpc.name as category_name, cb.name as brand_name, cm.name as model_name
        FROM product_listings pl
        LEFT JOIN users u ON pl.user_id = u.id
        LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
        LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
        LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
        LEFT JOIN car_models cm ON cp.car_model_id = cm.id
        WHERE pl.status = 'active' 
          AND pl.price_usd >= $1 
          AND pl.price_usd <= $2
        ORDER BY pl.price_usd ASC, pl.created_date DESC
        LIMIT $3
      `;

      const result = await query(priceQuery, [minPrice, maxPrice, limit]);
      return result.rows;
    } catch (error) {
      console.error('Price range listings error:', error);
      throw error;
    }
  }

  // Get recently viewed listings (would need a view tracking system)
  static async getRecentlyViewed(userId, limit = 10) {
    try {
      // This would typically use a separate view tracking table
      // For now, return recent listings from the same user's browsing history
      const recentQuery = `
        SELECT pl.*, u.first_name, u.last_name, u.username,
               cp.name as part_name, cp.image as part_image,
               cpc.name as category_name, cb.name as brand_name, cm.name as model_name
        FROM product_listings pl
        LEFT JOIN users u ON pl.user_id = u.id
        LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
        LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
        LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
        LEFT JOIN car_models cm ON cp.car_model_id = cm.id
        WHERE pl.status = 'active'
        ORDER BY pl.created_date DESC
        LIMIT $1
      `;

      const result = await query(recentQuery, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Recently viewed error:', error);
      throw error;
    }
  }
}
