import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  constructor(data) {
    this.id = data.id || data._id;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'buyer';
    this.admin = data.admin || false;
    this.createdDate = data.created_date;
  }

  // Create a new user
  static async create(userData) {
    const { firstName, lastName, username, email, password, role = 'buyer', admin = false } = userData;
    
    // Set admin flag based on role if not explicitly provided
    const isAdmin = admin || role === 'admin';
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const result = await query(
      `INSERT INTO users (first_name, last_name, username, email, password, role, admin)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *, _id as id`,
      [firstName, lastName, username, email, hashedPassword, role, isAdmin]
    );
    
    return new User(result.rows[0]);
  }

  // Find user by ID
  static async findById(id) {
    const result = await query('SELECT *, _id as id, COALESCE(role, \'buyer\') as role FROM users WHERE _id = $1', [id]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query('SELECT *, _id as id, COALESCE(role, \'buyer\') as role FROM users WHERE email = $1', [email]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Find user by username
  static async findByUsername(username) {
    const result = await query('SELECT *, _id as id, COALESCE(role, \'buyer\') as role FROM users WHERE username = $1', [username]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Get all users (with pagination)
  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT *, _id as id FROM users ORDER BY created_date DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows.map(row => new User(row));
  }

  // Update user
  async update(updateData) {
    const allowedFields = ['first_name', 'last_name', 'username', 'email'];
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
      `UPDATE users SET ${updates.join(', ')} WHERE _id = $${paramCount} RETURNING *, _id as id`,
      values
    );

    return new User(result.rows[0]);
  }

  // Update password
  async updatePassword(newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const result = await query(
      'UPDATE users SET password = $1 WHERE _id = $2 RETURNING *, _id as id',
      [hashedPassword, this.id]
    );
    
    return new User(result.rows[0]);
  }

  // Delete user
  async delete() {
    await query('DELETE FROM users WHERE _id = $1', [this.id]);
    return true;
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Get user's listings
  async getListings(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT pl.*, cp.name as part_name, cp.image as part_image
       FROM product_listings pl
       LEFT JOIN car_parts cp ON pl.car_part_id = cp.id
       WHERE pl.user_id = $1
       ORDER BY pl.created_date DESC
       LIMIT $2 OFFSET $3`,
      [this.id, limit, offset]
    );
    return result.rows;
  }

  // Get user's listing count
  async getListingCount() {
    const result = await query(
      'SELECT COUNT(*) as count FROM product_listings WHERE user_id = $1',
      [this.id]
    );
    return parseInt(result.rows[0].count);
  }

  // Convert to JSON (exclude password)
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}



