import { query } from '../config/database.js';

export class CarModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.carBrandId = data.car_brand_id;
    this.yearsStart = data.years_start;
    this.yearsEnd = data.years_end;
    this.createdDate = data.created_date;
  }

  // Create a new car model
  static async create(modelData) {
    const { name, carBrandId, yearsStart, yearsEnd } = modelData;
    const result = await query(
      `INSERT INTO car_models (name, car_brand_id, years_start, years_end)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, carBrandId, yearsStart, yearsEnd]
    );
    return new CarModel(result.rows[0]);
  }

  // Find model by ID
  static async findById(id) {
    const result = await query(
      `SELECT cm.*, cb.name as brand_name
       FROM car_models cm
       JOIN car_brands cb ON cm.car_brand_id = cb.id
       WHERE cm.id = $1`,
      [id]
    );
    return result.rows.length > 0 ? new CarModel(result.rows[0]) : null;
  }

  // Find models by brand ID
  static async findByBrandId(brandId, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT cm.*, cb.name as brand_name
       FROM car_models cm
       JOIN car_brands cb ON cm.car_brand_id = cb.id
       WHERE cm.car_brand_id = $1
       ORDER BY cm.name ASC
       LIMIT $2 OFFSET $3`,
      [brandId, limit, offset]
    );
    return result.rows.map(row => new CarModel(row));
  }

  // Search models by name and brand
  static async search(searchTerm, brandId = null, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    let queryText = `
      SELECT cm.*, cb.name as brand_name
      FROM car_models cm
      JOIN car_brands cb ON cm.car_brand_id = cb.id
      WHERE cm.name ILIKE $1
    `;
    let params = [`%${searchTerm}%`];
    let paramCount = 2;

    if (brandId) {
      queryText += ` AND cm.car_brand_id = $${paramCount}`;
      params.push(brandId);
      paramCount++;
    }

    queryText += ` ORDER BY cm.name ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows.map(row => new CarModel(row));
  }

  // Get all models
  static async findAll(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT cm.*, cb.name as brand_name
       FROM car_models cm
       JOIN car_brands cb ON cm.car_brand_id = cb.id
       ORDER BY cb.name ASC, cm.name ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows.map(row => new CarModel(row));
  }

  // Update model
  async update(updateData) {
    const { name, yearsStart, yearsEnd } = updateData;
    const result = await query(
      `UPDATE car_models 
       SET name = $1, years_start = $2, years_end = $3
       WHERE id = $4 RETURNING *`,
      [name, yearsStart, yearsEnd, this.id]
    );
    return new CarModel(result.rows[0]);
  }

  // Delete model
  async delete() {
    await query('DELETE FROM car_models WHERE id = $1', [this.id]);
    return true;
  }

  // Get compatible parts for this model
  async getCompatibleParts(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT cp.*, cpc.name as category_name, cb.name as brand_name
       FROM car_parts cp
       LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
       LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
       JOIN parts_compatibility pc ON cp.id = pc.car_part_id
       WHERE pc.car_model_id = $1
       ORDER BY cp.created_date DESC
       LIMIT $2 OFFSET $3`,
      [this.id, limit, offset]
    );
    return result.rows;
  }

  // Get part count for this model
  async getPartCount() {
    const result = await query(
      `SELECT COUNT(*) as count 
       FROM car_parts cp
       JOIN parts_compatibility pc ON cp.id = pc.car_part_id
       WHERE pc.car_model_id = $1`,
      [this.id]
    );
    return parseInt(result.rows[0].count);
  }

  // Get year range as string
  getYearRange() {
    if (this.yearsStart && this.yearsEnd) {
      return `${this.yearsStart}-${this.yearsEnd}`;
    } else if (this.yearsStart) {
      return `${this.yearsStart}+`;
    }
    return 'Unknown';
  }
}



