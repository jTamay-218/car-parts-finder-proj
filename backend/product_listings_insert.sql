-- Add more car brands
INSERT INTO car_brands (_id, name, user_id, created_date) VALUES 
('honda-id', 'Honda', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('toyota-id', 'Toyota', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('ford-id', 'Ford', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('chevrolet-id', 'Chevrolet', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('nissan-id', 'Nissan', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('audi-id', 'Audi', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('volkswagen-id', 'Volkswagen', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW()),
('lexus-id', 'Lexus', 'cf6cc49b-b8e6-456e-a253-e97558104e72', NOW());

-- Add more car models
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
('q7-2020', 'Q7', 'audi-id', 2020, NOW());

-- Add more categories
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
('exhaust', 'Exhaust System', NULL, NOW());

-- Add more product listings
INSERT INTO product_listings (_id, name, serial_number, description, price, image, condition, status, model_id, brand_id, category_id, user_id, address_id, production_year, created_date) VALUES 
-- Honda Civic parts
('honda-brake-pads-1', 'Honda Civic Brake Pads', 'HCBP001', 'High-quality ceramic brake pads for Honda Civic 2020-2021. Excellent stopping power and low dust.', 45.99, NULL, 'NEW', 'AVAILABLE', 'civic-2020', 'honda-id', 'brake-pads', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),
('honda-alternator-1', 'Honda Civic Alternator', 'HCALT001', 'Remanufactured alternator for Honda Civic. Tested and guaranteed to work perfectly.', 125.50, NULL, 'REFURBISHED', 'AVAILABLE', 'civic-2021', 'honda-id', 'alternator', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, NOW()),
('honda-headlight-1', 'Honda Civic LED Headlight', 'HCHL001', 'OEM LED headlight assembly for Honda Civic. Perfect condition, plug and play installation.', 89.99, NULL, 'USED', 'AVAILABLE', 'civic-2020', 'honda-id', 'headlights', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),

-- Toyota Camry parts
('toyota-brake-rotors-1', 'Toyota Camry Brake Rotors', 'TCBR001', 'Premium brake rotors for Toyota Camry. Drilled and slotted for better heat dissipation.', 75.00, NULL, 'NEW', 'AVAILABLE', 'camry-2020', 'toyota-id', 'brake-rotors', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),
('toyota-battery-1', 'Toyota Camry Car Battery', 'TCBAT001', 'High-performance car battery for Toyota Camry. 24-month warranty included.', 95.99, NULL, 'NEW', 'AVAILABLE', 'camry-2021', 'toyota-id', 'battery', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, NOW()),
('toyota-radiator-1', 'Toyota Camry Radiator', 'TCRAD001', 'All-aluminum radiator for Toyota Camry. Excellent cooling performance.', 120.00, NULL, 'USED', 'AVAILABLE', 'camry-2020', 'toyota-id', 'radiator', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),

-- Ford F-150 parts
('ford-spark-plugs-1', 'Ford F-150 Spark Plugs', 'FFSP001', 'Iridium spark plugs for Ford F-150. Set of 8 plugs, improves fuel efficiency.', 35.99, NULL, 'NEW', 'AVAILABLE', 'f150-2020', 'ford-id', 'spark-plugs', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),
('ford-mirror-1', 'Ford F-150 Side Mirror', 'FFMIR001', 'Power side mirror for Ford F-150. Includes heating and turn signal.', 65.00, NULL, 'USED', 'AVAILABLE', 'f150-2021', 'ford-id', 'mirrors', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, NOW()),
('ford-taillight-1', 'Ford F-150 Tail Light', 'FFTL001', 'LED tail light assembly for Ford F-150. Waterproof and durable.', 45.99, NULL, 'NEW', 'AVAILABLE', 'f150-2020', 'ford-id', 'taillights', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),

-- BMW 3 Series parts
('bmw-windshield-1', 'BMW 3 Series Windshield', 'BMWW001', 'OEM windshield for BMW 3 Series. Includes rain sensor and heated windshield elements.', 299.99, NULL, 'NEW', 'AVAILABLE', '3series-2020', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 'windshield', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),
('bmw-oil-filter-1', 'BMW 3 Series Oil Filter', 'BMWOF001', 'High-quality oil filter for BMW 3 Series. Synthetic media for better filtration.', 12.99, NULL, 'NEW', 'AVAILABLE', '3series-2021', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 'oil-filter', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, NOW()),
('bmw-air-filter-1', 'BMW 3 Series Air Filter', 'BMWAF001', 'Performance air filter for BMW 3 Series. Washable and reusable.', 25.50, NULL, 'NEW', 'AVAILABLE', '3series-2020', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 'air-filter', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),

-- Audi A4 parts
('audi-suspension-1', 'Audi A4 Suspension Strut', 'AASTR001', 'Premium suspension strut for Audi A4. Improves ride quality and handling.', 185.99, NULL, 'NEW', 'AVAILABLE', 'a4-2020', 'audi-id', 'suspension', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),
('audi-exhaust-1', 'Audi A4 Exhaust Muffler', 'AAEXH001', 'Performance exhaust muffler for Audi A4. Deep sporty sound.', 155.00, NULL, 'USED', 'AVAILABLE', 'a4-2021', 'audi-id', 'exhaust', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, NOW()),
('audi-transmission-1', 'Audi A4 Transmission Fluid', 'AATF001', 'Premium transmission fluid for Audi A4. Extends transmission life.', 22.99, NULL, 'NEW', 'AVAILABLE', 'a4-2020', 'audi-id', 'transmission', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),

-- Chevrolet Silverado parts
('chevrolet-brake-pads-2', 'Chevrolet Silverado Brake Pads', 'CSBP001', 'Heavy-duty brake pads for Chevrolet Silverado. Designed for towing and hauling.', 55.99, NULL, 'NEW', 'AVAILABLE', 'silverado-2020', 'chevrolet-id', 'brake-pads', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),
('chevrolet-alternator-2', 'Chevrolet Silverado Alternator', 'CSALT001', 'High-output alternator for Chevrolet Silverado. Perfect for additional electrical accessories.', 175.50, NULL, 'REFURBISHED', 'AVAILABLE', 'silverado-2021', 'chevrolet-id', 'alternator', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, NOW()),
('chevrolet-radiator-2', 'Chevrolet Silverado Radiator', 'CSRAD001', 'Heavy-duty radiator for Chevrolet Silverado. Aluminum construction for durability.', 145.99, NULL, 'NEW', 'AVAILABLE', 'silverado-2020', 'chevrolet-id', 'radiator', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),

-- More Honda Accord parts
('honda-accord-battery', 'Honda Accord Car Battery', 'HABAT001', 'Premium car battery for Honda Accord. 36-month warranty and excellent cold-cranking amps.', 88.99, NULL, 'NEW', 'AVAILABLE', 'accord-2020', 'honda-id', 'battery', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),
('honda-accord-mirror', 'Honda Accord Side Mirror', 'HAMIR001', 'Power side mirror with defroster for Honda Accord. Easy installation.', 72.50, NULL, 'USED', 'AVAILABLE', 'accord-2021', 'honda-id', 'mirrors', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, NOW()),

-- More Toyota Corolla parts
('toyota-corolla-headlight', 'Toyota Corolla Headlight', 'TCHL001', 'OEM headlight assembly for Toyota Corolla. Crystal clear lens and bright output.', 95.99, NULL, 'NEW', 'AVAILABLE', 'corolla-2020', 'toyota-id', 'headlights', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),
('toyota-corolla-spark-plugs', 'Toyota Corolla Spark Plugs', 'TCSP001', 'Set of 4 iridium spark plugs for Toyota Corolla. Improves performance and fuel economy.', 28.99, NULL, 'NEW', 'AVAILABLE', 'corolla-2021', 'toyota-id', 'spark-plugs', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, NOW()),

-- Ford Mustang parts
('ford-mustang-exhaust', 'Ford Mustang Exhaust System', 'FMEXH001', 'Performance exhaust system for Ford Mustang. Aggressive sound and better performance.', 299.99, NULL, 'NEW', 'AVAILABLE', 'mustang-2020', 'ford-id', 'exhaust', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),
('ford-mustang-air-filter', 'Ford Mustang Air Filter', 'FMAF001', 'High-flow air filter for Ford Mustang. Washable and reusable design.', 35.99, NULL, 'NEW', 'AVAILABLE', 'mustang-2020', 'ford-id', 'air-filter', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),

-- BMW X5 parts
('bmw-x5-brake-rotors', 'BMW X5 Brake Rotors', 'BMX5BR001', 'Premium brake rotors for BMW X5. Cross-drilled for better heat dissipation.', 125.99, NULL, 'NEW', 'AVAILABLE', 'x5-2020', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 'brake-rotors', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW()),
('bmw-x5-windshield', 'BMW X5 Windshield', 'BMX5W001', 'OEM windshield for BMW X5 with rain sensor and heated wiper area.', 399.99, NULL, 'NEW', 'AVAILABLE', 'x5-2020', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 'windshield', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, NOW());
