import { query } from '../config/database.js';

export class ProductListing {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.carPartId = data.car_part_id;
    this.name = data.name;
    this.description = data.description;
    this.priceUsd = data.price_usd;
    this.condition = data.condition;
    this.location = data.location;
    this.status = data.status;
    this.phoneNumber = data.phone_number;
    this.email = data.email;
    this.model = data.model;
    this.year = data.year;
    this.createdDate = data.created_date;
  }

  // Create a new listing
  static async create(listingData) {
    const {
      userId,
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
    } = listingData;

    const result = await query(
      `INSERT INTO product_listings 
       (user_id, car_part_id, name, description, price_usd, condition, location, status, phone_number, email, model, year)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [userId, carPartId, name, description, priceUsd, condition, location, status, phoneNumber, email, model, year]
    );
    return new ProductListing(result.rows[0]);
  }

  // Find listing by ID
  static async findById(id) {
    const result = await query(
      `SELECT pl.*, u.first_name, u.last_name, u.username, u.email as user_email,
              cp.name as part_name, cp.image as part_image, cp.serial_number,
              cpc.name as category_name, cb.name as brand_name, cm.name as model_name
       FROM product_listings pl
       LEFT JOIN users u ON pl.user_id = u.id
       LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
       LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
       LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
       LEFT JOIN car_models cm ON cp.car_model_id = cm.id
       WHERE pl.id = $1`,
      [id]
    );
    return result.rows.length > 0 ? new ProductListing(result.rows[0]) : null;
  }

  // Get all listings with filters
  static async findAll(filters = {}, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const {
      status = 'active',
      condition,
      minPrice,
      maxPrice,
      location,
      searchTerm,
      brandId,
      modelId,
      categoryId,
      userId
    } = filters;

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
      WHERE pl.status = $1
    `;
    const params = [status];
    let paramCount = 2;

    if (condition) {
      queryText += ` AND pl.condition = $${paramCount}`;
      params.push(condition);
      paramCount++;
    }

    if (minPrice !== undefined) {
      queryText += ` AND pl.price_usd >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice !== undefined) {
      queryText += ` AND pl.price_usd <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }

    if (location) {
      queryText += ` AND pl.location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
      paramCount++;
    }

    if (searchTerm) {
      queryText += ` AND (pl.name ILIKE $${paramCount} OR pl.description ILIKE $${paramCount})`;
      params.push(`%${searchTerm}%`);
      paramCount++;
    }

    if (brandId) {
      queryText += ` AND cb.id = $${paramCount}`;
      params.push(brandId);
      paramCount++;
    }

    if (modelId) {
      queryText += ` AND cm.id = $${paramCount}`;
      params.push(modelId);
      paramCount++;
    }

    if (categoryId) {
      queryText += ` AND cpc.id = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    if (userId) {
      queryText += ` AND pl.user_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }

    queryText += ` ORDER BY pl.created_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows.map(row => new ProductListing(row));
  }

  // Search listings
  static async search(searchTerm, filters = {}, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const {
      status = 'active',
      condition,
      minPrice,
      maxPrice,
      location,
      brandId,
      modelId,
      categoryId
    } = filters;

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
      WHERE pl.status = $1 AND (pl.name ILIKE $2 OR pl.description ILIKE $2)
    `;
    const params = [status, `%${searchTerm}%`];
    let paramCount = 3;

    if (condition) {
      queryText += ` AND pl.condition = $${paramCount}`;
      params.push(condition);
      paramCount++;
    }

    if (minPrice !== undefined) {
      queryText += ` AND pl.price_usd >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice !== undefined) {
      queryText += ` AND pl.price_usd <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }

    if (location) {
      queryText += ` AND pl.location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
      paramCount++;
    }

    if (brandId) {
      queryText += ` AND cb.id = $${paramCount}`;
      params.push(brandId);
      paramCount++;
    }

    if (modelId) {
      queryText += ` AND cm.id = $${paramCount}`;
      params.push(modelId);
      paramCount++;
    }

    if (categoryId) {
      queryText += ` AND cpc.id = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    queryText += ` ORDER BY pl.created_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows.map(row => new ProductListing(result.rows[0]));
  }

  // Update listing
  async update(updateData) {
    const allowedFields = [
      'name', 'description', 'price_usd', 'condition', 'location',
      'status', 'phone_number', 'email', 'model', 'year'
    ];
    const updates = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(this.id);
    const result = await query(
      `UPDATE product_listings SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return new ProductListing(result.rows[0]);
  }

  // Delete listing
  async delete() {
    await query('DELETE FROM product_listings WHERE id = $1', [this.id]);
    return true;
  }

  // Get listings by user
  static async findByUserId(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT pl.*, cp.name as part_name, cp.image as part_image,
              cpc.name as category_name, cb.name as brand_name, cm.name as model_name
       FROM product_listings pl
       LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
       LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
       LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
       LEFT JOIN car_models cm ON cp.car_model_id = cm.id
       WHERE pl.user_id = $1
       ORDER BY pl.created_date DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows.map(row => new ProductListing(row));
  }

  // Get listing count by filters
  static async getCount(filters = {}) {
    const {
      status = 'active',
      condition,
      minPrice,
      maxPrice,
      location,
      searchTerm,
      brandId,
      modelId,
      categoryId,
      userId
    } = filters;

    let queryText = `
      SELECT COUNT(*) as count
      FROM product_listings pl
      LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
      LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
      LEFT JOIN car_models cm ON cp.car_model_id = cm.id
      LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
      WHERE pl.status = $1
    `;
    const params = [status];
    let paramCount = 2;

    if (condition) {
      queryText += ` AND pl.condition = $${paramCount}`;
      params.push(condition);
      paramCount++;
    }

    if (minPrice !== undefined) {
      queryText += ` AND pl.price_usd >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice !== undefined) {
      queryText += ` AND pl.price_usd <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }

    if (location) {
      queryText += ` AND pl.location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
      paramCount++;
    }

    if (searchTerm) {
      queryText += ` AND (pl.name ILIKE $${paramCount} OR pl.description ILIKE $${paramCount})`;
      params.push(`%${searchTerm}%`);
      paramCount++;
    }

    if (brandId) {
      queryText += ` AND cb.id = $${paramCount}`;
      params.push(brandId);
      paramCount++;
    }

    if (modelId) {
      queryText += ` AND cm.id = $${paramCount}`;
      params.push(modelId);
      paramCount++;
    }

    if (categoryId) {
      queryText += ` AND cpc.id = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    if (userId) {
      queryText += ` AND pl.user_id = $${paramCount}`;
      params.push(userId);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].count);
  }

  // Get seller information
  getSellerInfo() {
    return {
      firstName: this.first_name,
      lastName: this.last_name,
      username: this.username,
      email: this.user_email
    };
  }
}
