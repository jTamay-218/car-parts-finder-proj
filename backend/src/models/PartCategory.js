import { query } from '../config/database.js';

export class PartCategory {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.createdDate = data.created_date;
  }

  // Create a new part category
  static async create(name) {
    const result = await query(
      'INSERT INTO car_parts_categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    return new PartCategory(result.rows[0]);
  }

  // Find category by ID
  static async findById(id) {
    const result = await query('SELECT * FROM car_parts_categories WHERE id = $1', [id]);
    return result.rows.length > 0 ? new PartCategory(result.rows[0]) : null;
  }

  // Find category by name
  static async findByName(name) {
    const result = await query('SELECT * FROM car_parts_categories WHERE name ILIKE $1', [name]);
    return result.rows.length > 0 ? new PartCategory(result.rows[0]) : null;
  }

  // Get all categories
  static async findAll(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT * FROM car_parts_categories ORDER BY name ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows.map(row => new PartCategory(row));
  }

  // Search categories by name
  static async search(searchTerm, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT * FROM car_parts_categories WHERE name ILIKE $1 ORDER BY name ASC LIMIT $2 OFFSET $3',
      [`%${searchTerm}%`, limit, offset]
    );
    return result.rows.map(row => new PartCategory(row));
  }

  // Update category
  async update(name) {
    const result = await query(
      'UPDATE car_parts_categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, this.id]
    );
    return new PartCategory(result.rows[0]);
  }

  // Delete category
  async delete() {
    await query('DELETE FROM car_parts_categories WHERE id = $1', [this.id]);
    return true;
  }

  // Get parts in this category
  async getParts(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT cp.*, cpc.name as category_name, cb.name as brand_name, cm.name as model_name
       FROM car_parts cp
       LEFT JOIN car_parts_categories cpc ON cp.car_part_category_id = cpc.id
       LEFT JOIN car_brands cb ON cp.car_brand_id = cb.id
       LEFT JOIN car_models cm ON cp.car_model_id = cm.id
       WHERE cp.car_part_category_id = $1
       ORDER BY cp.created_date DESC
       LIMIT $2 OFFSET $3`,
      [this.id, limit, offset]
    );
    return result.rows;
  }

  // Get part count for this category
  async getPartCount() {
    const result = await query(
      'SELECT COUNT(*) as count FROM car_parts WHERE car_part_category_id = $1',
      [this.id]
    );
    return parseInt(result.rows[0].count);
  }

  // Get categories with part counts
  static async findAllWithCounts(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT cpc.*, COUNT(cp.id) as part_count
       FROM car_parts_categories cpc
       LEFT JOIN car_parts cp ON cpc.id = cp.car_part_category_id
       GROUP BY cpc.id, cpc.name, cpc.created_date
       ORDER BY part_count DESC, cpc.name ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows.map(row => ({
      ...new PartCategory(row),
      partCount: parseInt(row.part_count)
    }));
  }
}





