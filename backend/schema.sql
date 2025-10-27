-- Car Parts Finder Database Schema
-- Run this in Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  admin BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create car_brands table
CREATE TABLE IF NOT EXISTS car_brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT REFERENCES users(id),
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create car_models table
CREATE TABLE IF NOT EXISTS car_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  car_brand_id TEXT REFERENCES car_brands(id),
  production_year INTEGER,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table (part categories)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  street TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create product_listings table
CREATE TABLE IF NOT EXISTS product_listings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  serial_number TEXT,
  description TEXT,
  price DECIMAL(10, 2),
  image TEXT,
  condition TEXT,
  status TEXT DEFAULT 'AVAILABLE',
  model_id TEXT REFERENCES car_models(id),
  brand_id TEXT REFERENCES car_brands(id),
  category_id TEXT REFERENCES categories(id),
  user_id TEXT REFERENCES users(id),
  address_id TEXT REFERENCES addresses(id),
  production_year INTEGER,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_listings_status ON product_listings(status);
CREATE INDEX IF NOT EXISTS idx_product_listings_user_id ON product_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_brand_id ON product_listings(brand_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_model_id ON product_listings(model_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_category_id ON product_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_car_models_brand_id ON car_models(car_brand_id);

