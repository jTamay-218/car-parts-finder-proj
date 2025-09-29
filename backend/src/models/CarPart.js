import { query } from '../config/database.js';

export class CarPart {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.carPartCategoryId = data.car_part_category_id;
    this.serialNumber = data.serial_number;
    this.description = data.description;
    this.price = data.price;
    this.image = data.image;
    this.condition = data.condition;
    this.carModelId = data.car_model_id;
    this.carBrandId = data.car_brand_id;
    this.createdDate = data.created_date;
  }

  // Create a new car part
  static async create(partData) {
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
    } = partData;

    const result = await query(
      `INSERT INTO car_parts 
       (name, car_part_category_id, serial_number, description, price, image, condition, car_model_id, car_brand_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, carPartCategoryId, serialNumber, description, price, image, condition, carModelId, carBrandId]
    );
    return new CarPart(result.rows[0]);
  }

  // Find part by ID
  static async findById(id) {
    const result = await query(
      `SELECT cp.*, cpc.name as category_name, cb.name as brand_name, cm.name as model_name
       FROM car_parts cp
       LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
       LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
       LEFT JOIN car_models cm ON cp.car_model_id = cm.id
       WHERE cp.id = $1`,
      [id]
    );
    return result.rows.length > 0 ? new CarPart(result.rows[0]) : null;
  }

  // Get all parts with filters
  static async findAll(filters = {}, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const {
      categoryId,
      brandId,
      modelId,
      condition,
      minPrice,
      maxPrice,
      searchTerm
    } = filters;

    let queryText = `
      SELECT cp.*, cpc.name as category_name, cb.name as brand_name, cm.name as model_name
      FROM car_parts cp
      LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
      LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
      LEFT JOIN car_models cm ON cp.car_model_id = cm.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (categoryId) {
      queryText += ` AND cp.car_part_category_id = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    if (brandId) {
      queryText += ` AND cp.car_brand_id = $${paramCount}`;
      params.push(brandId);
      paramCount++;
    }

    if (modelId) {
      queryText += ` AND cp.car_model_id = $${paramCount}`;
      params.push(modelId);
      paramCount++;
    }

    if (condition) {
      queryText += ` AND cp.condition = $${paramCount}`;
      params.push(condition);
      paramCount++;
    }

    if (minPrice !== undefined) {
      queryText += ` AND cp.price >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice !== undefined) {
      queryText += ` AND cp.price <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }

    if (searchTerm) {
      queryText += ` AND (cp.name ILIKE $${paramCount} OR cp.description ILIKE $${paramCount})`;
      params.push(`%${searchTerm}%`);
      paramCount++;
    }

    queryText += ` ORDER BY cp.created_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows.map(row => new CarPart(row));
  }

  // Search parts
  static async search(searchTerm, filters = {}, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const {
      categoryId,
      brandId,
      modelId,
      condition,
      minPrice,
      maxPrice
    } = filters;

    let queryText = `
      SELECT cp.*, cpc.name as category_name, cb.name as brand_name, cm.name as model_name
      FROM car_parts cp
      LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
      LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
      LEFT JOIN car_models cm ON cp.car_model_id = cm.id
      WHERE (cp.name ILIKE $1 OR cp.description ILIKE $1)
    `;
    const params = [`%${searchTerm}%`];
    let paramCount = 2;

    if (categoryId) {
      queryText += ` AND cp.car_part_category_id = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    if (brandId) {
      queryText += ` AND cp.car_brand_id = $${paramCount}`;
      params.push(brandId);
      paramCount++;
    }

    if (modelId) {
      queryText += ` AND cp.car_model_id = $${paramCount}`;
      params.push(modelId);
      paramCount++;
    }

    if (condition) {
      queryText += ` AND cp.condition = $${paramCount}`;
      params.push(condition);
      paramCount++;
    }

    if (minPrice !== undefined) {
      queryText += ` AND cp.price >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice !== undefined) {
      queryText += ` AND cp.price <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }

    queryText += ` ORDER BY cp.created_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows.map(row => new CarPart(row));
  }

  // Update part
  async update(updateData) {
    const allowedFields = [
      'name', 'car_part_category_id', 'serial_number', 'description',
      'price', 'image', 'condition', 'car_model_id', 'car_brand_id'
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
      `UPDATE car_parts SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return new CarPart(result.rows[0]);
  }

  // Delete part
  async delete() {
    await query('DELETE FROM car_parts WHERE id = $1', [this.id]);
    return true;
  }

  // Add compatibility with a model
  async addCompatibility(modelId) {
    const result = await query(
      `INSERT INTO parts_compatibility (car_part_id, car_model_id)
       VALUES ($1, $2) RETURNING *`,
      [this.id, modelId]
    );
    return result.rows[0];
  }

  // Remove compatibility with a model
  async removeCompatibility(modelId) {
    await query(
      'DELETE FROM parts_compatibility WHERE car_part_id = $1 AND car_model_id = $2',
      [this.id, modelId]
    );
    return true;
  }

  // Get compatible models
  async getCompatibleModels() {
    const result = await query(
      `SELECT cm.*, cb.name as brand_name
       FROM car_models cm
       JOIN car_brands cb ON cm.car_brand_id = cb.id
       JOIN parts_compatibility pc ON cm.id = pc.car_model_id
       WHERE pc.car_part_id = $1
       ORDER BY cb.name ASC, cm.name ASC`,
      [this.id]
    );
    return result.rows;
  }

  // Get part count by filters
  static async getCount(filters = {}) {
    const {
      categoryId,
      brandId,
      modelId,
      condition,
      minPrice,
      maxPrice,
      searchTerm
    } = filters;

    let queryText = 'SELECT COUNT(*) as count FROM car_parts WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (categoryId) {
      queryText += ` AND car_part_category_id = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    if (brandId) {
      queryText += ` AND car_brand_id = $${paramCount}`;
      params.push(brandId);
      paramCount++;
    }

    if (modelId) {
      queryText += ` AND car_model_id = $${paramCount}`;
      params.push(modelId);
      paramCount++;
    }

    if (condition) {
      queryText += ` AND condition = $${paramCount}`;
      params.push(condition);
      paramCount++;
    }

    if (minPrice !== undefined) {
      queryText += ` AND price >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice !== undefined) {
      queryText += ` AND price <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }

    if (searchTerm) {
      queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${searchTerm}%`);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].count);
  }
}
