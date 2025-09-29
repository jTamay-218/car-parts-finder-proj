import { query } from '../config/database.js';

export class CarBrand {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.createdDate = data.created_date;
  }

  // Create a new car brand
  static async create(name) {
    const result = await query(
      'INSERT INTO car_brands (name) VALUES ($1) RETURNING *',
      [name]
    );
    return new CarBrand(result.rows[0]);
  }

  // Find brand by ID
  static async findById(id) {
    const result = await query('SELECT * FROM car_brands WHERE id = $1', [id]);
    return result.rows.length > 0 ? new CarBrand(result.rows[0]) : null;
  }

  // Find brand by name
  static async findByName(name) {
    const result = await query('SELECT * FROM car_brands WHERE name ILIKE $1', [name]);
    return result.rows.length > 0 ? new CarBrand(result.rows[0]) : null;
  }

  // Get all brands
  static async findAll(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT * FROM car_brands ORDER BY name ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows.map(row => new CarBrand(row));
  }

  // Search brands by name
  static async search(searchTerm, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT * FROM car_brands WHERE name ILIKE $1 ORDER BY name ASC LIMIT $2 OFFSET $3',
      [`%${searchTerm}%`, limit, offset]
    );
    return result.rows.map(row => new CarBrand(row));
  }

  // Update brand
  async update(name) {
    const result = await query(
      'UPDATE car_brands SET name = $1 WHERE id = $2 RETURNING *',
      [name, this.id]
    );
    return new CarBrand(result.rows[0]);
  }

  // Delete brand
  async delete() {
    await query('DELETE FROM car_brands WHERE id = $1', [this.id]);
    return true;
  }

  // Get models for this brand
  async getModels(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT cm.*, cb.name as brand_name
       FROM car_models cm
       JOIN car_brands cb ON cm.car_brand_id = cb.id
       WHERE cm.car_brand_id = $1
       ORDER BY cm.name ASC
       LIMIT $2 OFFSET $3`,
      [this.id, limit, offset]
    );
    return result.rows;
  }

  // Get model count for this brand
  async getModelCount() {
    const result = await query(
      'SELECT COUNT(*) as count FROM car_models WHERE car_brand_id = $1',
      [this.id]
    );
    return parseInt(result.rows[0].count);
  }

  // Get parts for this brand
  async getParts(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT cp.*, cpc.name as category_name, cb.name as brand_name
       FROM car_parts cp
       LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
       LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
       WHERE cp.car_brand_id = $1
       ORDER BY cp.created_date DESC
       LIMIT $2 OFFSET $3`,
      [this.id, limit, offset]
    );
    return result.rows;
  }

  // Get part count for this brand
  async getPartCount() {
    const result = await query(
      'SELECT COUNT(*) as count FROM car_parts WHERE car_brand_id = $1',
      [this.id]
    );
    return parseInt(result.rows[0].count);
  }
}
