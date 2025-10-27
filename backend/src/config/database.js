import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

// Parse database URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set in environment variables');
  process.exit(1);
}

// Create a connection pool
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false // Supabase requires SSL
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected database pool error:', err);
});

// Test database connection
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL database connected successfully');
    console.log('📅 Database time:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
};

// Initialize database connection
export const initDatabase = async () => {
  try {
    await testConnection();
    return pool;
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    throw err;
  }
};

// Get database instance
export const getDatabase = async () => {
  return pool;
};

// Query helper function
export const query = async (sql, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(sql, params);
    const duration = Date.now() - start;
    console.log('Executed query', { sql, duration, rows: result.rowCount });
    return { rows: result.rows, rowCount: result.rowCount };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Query helper for single row
export const queryOne = async (sql, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(sql, params);
    const duration = Date.now() - start;
    console.log('Executed query', { sql, duration, rows: result.rows.length });
    return { rows: result.rows, rowCount: result.rows.length };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute helper for INSERT/UPDATE/DELETE
export const execute = async (sql, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(sql, params);
    const duration = Date.now() - start;
    console.log('Executed query', { sql, duration, changes: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
};

export default pool;
