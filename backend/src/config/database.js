import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.join(__dirname, '../../carpartsus.db');

// Create database connection
let db = null;

// Initialize database connection
export const initDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    console.log('✅ SQLite database connected successfully');
    return db;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    throw err;
  }
};

// Get database instance
export const getDatabase = async () => {
  if (!db) {
    await initDatabase();
  }
  return db;
};

// Test database connection
export const testConnection = async () => {
  try {
    const database = await getDatabase();
    await database.get('SELECT 1');
    console.log('✅ Database connected successfully');
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
};

// Query helper function
export const query = async (sql, params = []) => {
  const start = Date.now();
  try {
    const database = await getDatabase();
    const result = await database.all(sql, params);
    const duration = Date.now() - start;
    console.log('Executed query', { sql, duration, rows: result.length });
    return { rows: result, rowCount: result.length };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Query helper for single row
export const queryOne = async (sql, params = []) => {
  const start = Date.now();
  try {
    const database = await getDatabase();
    const result = await database.get(sql, params);
    const duration = Date.now() - start;
    console.log('Executed query', { sql, duration, rows: result ? 1 : 0 });
    return { rows: result ? [result] : [], rowCount: result ? 1 : 0 };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute helper for INSERT/UPDATE/DELETE
export const execute = async (sql, params = []) => {
  const start = Date.now();
  try {
    const database = await getDatabase();
    const result = await database.run(sql, params);
    const duration = Date.now() - start;
    console.log('Executed query', { sql, duration, changes: result.changes });
    return result;
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
};

export default db;



