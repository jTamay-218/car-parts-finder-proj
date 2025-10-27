-- Sample Data for Car Parts Finder
-- Run this AFTER schema.sql in Supabase SQL Editor

-- Insert test user (for foreign key constraints)
INSERT INTO users (_id, first_name, last_name, username, email, password, admin, created_date) VALUES 
('cf6cc49b-b8e6-456e-a253-e97558104e72', 'Test', 'User', 'testuser', 'test@example.com', 'hashed_password', TRUE, NOW())
ON CONFLICT (_id) DO NOTHING;

-- Insert car brands
INSERT INTO car_brands (_id, name, user_id, created_date) VALUES 
('honda-id', 'Honda', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('toyota-id', 'Toyota', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('ford-id', 'Ford', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('chevrolet-id', 'Chevrolet', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('nissan-id', 'Nissan', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('audi-id', 'Audi', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('volkswagen-id', 'Volkswagen', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('lexus-id', 'Lexus', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('b41e288a-3dd0-4a7e-b420-21633a43b74d', 'BMW', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW())
ON CONFLICT (_id) DO NOTHING;

-- Insert car models
INSERT INTO car_models (_id, name, car_brand_id, production_year, created_date) VALUES 
-- Honda models
('civic-2020', 'Civic', 'honda-id', 2020, NOW()),
('civic-2021', 'Civic', 'honda-id', 2021, NOW()),
('accord-2020', 'Accord', 'honda-id', 2020, NOW()),
('accord-2021', 'Accord', 'honda-id', 2021, NOW()),
('cr-v-2020', 'CR-V', 'honda-id', 2020, NOW()),
-- Toyota models
('camry-2020', 'Camry', 'toyota-id', 2020, NOW()),
('camry-2021', 'Camry', 'toyota-id', 2021, NOW()),
('corolla-2020', 'Corolla', 'toyota-id', 2020, NOW()),
('corolla-2021', 'Corolla', 'toyota-id', 2021, NOW()),
('rav4-2020', 'RAV4', 'toyota-id', 2020, NOW()),
-- Ford models
('f150-2020', 'F-150', 'ford-id', 2020, NOW()),
('f150-2021', 'F-150', 'ford-id', 2021, NOW()),
('mustang-2020', 'Mustang', 'ford-id', 2020, NOW()),
('escape-2020', 'Escape', 'ford-id', 2020, NOW()),
-- Chevrolet models
('silverado-2020', 'Silverado', 'chevrolet-id', 2020, NOW()),
('silverado-2021', 'Silverado', 'chevrolet-id', 2021, NOW()),
('malibu-2020', 'Malibu', 'chevrolet-id', 2020, NOW()),
('equinox-2020', 'Equinox', 'chevrolet-id', 2020, NOW()),
-- BMW models
('3series-2020', '3 Series', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 2020, NOW()),
('3series-2021', '3 Series', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 2021, NOW()),
('x5-2020', 'X5', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 2020, NOW()),
('x3-2020', 'X3', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 2020, NOW()),
-- Audi models
('a4-2020', 'A4', 'audi-id', 2020, NOW()),
('a4-2021', 'A4', 'audi-id', 2021, NOW()),
('q5-2020', 'Q5', 'audi-id', 2020, NOW()),
('q7-2020', 'Q7', 'audi-id', 2020, NOW())
ON CONFLICT (_id) DO NOTHING;

-- Insert categories
INSERT INTO categories (_id, name, image, created_date) VALUES 
('brake-pads', 'Brake Pads', NULL, NOW()),
('brake-rotors', 'Brake Rotors', NULL, NOW()),
('alternator', 'Alternator', NULL, NOW()),
('battery', 'Car Battery', NULL, NOW()),
('headlights', 'Headlights', NULL, NOW()),
('taillights', 'Tail Lights', NULL, NOW()),
('mirrors', 'Side Mirrors', NULL, NOW()),
('windshield', 'Windshield', NULL, NOW()),
('radiator', 'Radiator', NULL, NOW()),
('spark-plugs', 'Spark Plugs', NULL, NOW()),
('oil-filter', 'Oil Filter', NULL, NOW()),
('air-filter', 'Air Filter', NULL, NOW()),
('transmission', 'Transmission Parts', NULL, NOW()),
('suspension', 'Suspension', NULL, NOW()),
('exhaust', 'Exhaust System', NULL, NOW())
ON CONFLICT (_id) DO NOTHING;

