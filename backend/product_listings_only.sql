INSERT INTO product_listings (_id, name, serial_number, description, price, image, condition, status, model_id, brand_id, category_id, user_id, address_id, production_year, created_date) VALUES 
-- Honda Civic parts
('honda-brake-pads-1', 'Honda Civic Brake Pads', 'HCBP001', 'High-quality ceramic brake pads for Honda Civic 2020-2021. Excellent stopping power and low dust.', 45.99, NULL, 'NEW', 'AVAILABLE', 'civic-2020', 'honda-id', 'brake-pads', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),
('honda-alternator-1', 'Honda Civic Alternator', 'HCALT001', 'Remanufactured alternator for Honda Civic. Tested and guaranteed to work perfectly.', 125.50, NULL, 'REFURBISHED', 'AVAILABLE', 'civic-2021', 'honda-id', 'alternator', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, datetime('now')),
('honda-headlight-1', 'Honda Civic LED Headlight', 'HCHL001', 'OEM LED headlight assembly for Honda Civic. Perfect condition, plug and play installation.', 89.99, NULL, 'USED', 'AVAILABLE', 'civic-2020', 'honda-id', 'headlights', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),

-- Toyota Camry parts
('toyota-brake-rotors-1', 'Toyota Camry Brake Rotors', 'TCBR001', 'Premium brake rotors for Toyota Camry. Drilled and slotted for better heat dissipation.', 75.00, NULL, 'NEW', 'AVAILABLE', 'camry-2020', 'toyota-id', 'brake-rotors', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),
('toyota-battery-1', 'Toyota Camry Car Battery', 'TCBAT001', 'High-performance car battery for Toyota Camry. 24-month warranty included.', 95.99, NULL, 'NEW', 'AVAILABLE', 'camry-2021', 'toyota-id', 'battery', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, datetime('now')),
('toyota-radiator-1', 'Toyota Camry Radiator', 'TCRAD001', 'All-aluminum radiator for Toyota Camry. Excellent cooling performance.', 120.00, NULL, 'USED', 'AVAILABLE', 'camry-2020', 'toyota-id', 'radiator', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),

-- Ford F-150 parts
('ford-spark-plugs-1', 'Ford F-150 Spark Plugs', 'FFSP001', 'Iridium spark plugs for Ford F-150. Set of 8 plugs, improves fuel efficiency.', 35.99, NULL, 'NEW', 'AVAILABLE', 'f150-2020', 'ford-id', 'spark-plugs', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),
('ford-mirror-1', 'Ford F-150 Side Mirror', 'FFMIR001', 'Power side mirror for Ford F-150. Includes heating and turn signal.', 65.00, NULL, 'USED', 'AVAILABLE', 'f150-2021', 'ford-id', 'mirrors', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, datetime('now')),
('ford-taillight-1', 'Ford F-150 Tail Light', 'FFTL001', 'LED tail light assembly for Ford F-150. Waterproof and durable.', 45.99, NULL, 'NEW', 'AVAILABLE', 'f150-2020', 'ford-id', 'taillights', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),

-- BMW 3 Series parts
('bmw-windshield-1', 'BMW 3 Series Windshield', 'BMWW001', 'OEM windshield for BMW 3 Series. Includes rain sensor and heated windshield elements.', 299.99, NULL, 'NEW', 'AVAILABLE', '3series-2020', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 'windshield', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),
('bmw-oil-filter-1', 'BMW 3 Series Oil Filter', 'BMWOF001', 'High-quality oil filter for BMW 3 Series. Synthetic media for better filtration.', 12.99, NULL, 'NEW', 'AVAILABLE', '3series-2021', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 'oil-filter', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, datetime('now')),
('bmw-air-filter-1', 'BMW 3 Series Air Filter', 'BMWAF001', 'Performance air filter for BMW 3 Series. Washable and reusable.', 25.50, NULL, 'NEW', 'AVAILABLE', '3series-2020', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 'air-filter', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),

-- Audi A4 parts
('audi-suspension-1', 'Audi A4 Suspension Strut', 'AASTR001', 'Premium suspension strut for Audi A4. Improves ride quality and handling.', 185.99, NULL, 'NEW', 'AVAILABLE', 'a4-2020', 'audi-id', 'suspension', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),
('audi-exhaust-1', 'Audi A4 Exhaust Muffler', 'AAEXH001', 'Performance exhaust muffler for Audi A4. Deep sporty sound.', 155.00, NULL, 'USED', 'AVAILABLE', 'a4-2021', 'audi-id', 'exhaust', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, datetime('now')),
('audi-transmission-1', 'Audi A4 Transmission Fluid', 'AATF001', 'Premium transmission fluid for Audi A4. Extends transmission life.', 22.99, NULL, 'NEW', 'AVAILABLE', 'a4-2020', 'audi-id', 'transmission', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),

-- Chevrolet Silverado parts
('chevrolet-brake-pads-2', 'Chevrolet Silverado Brake Pads', 'CSBP001', 'Heavy-duty brake pads for Chevrolet Silverado. Designed for towing and hauling.', 55.99, NULL, 'NEW', 'AVAILABLE', 'silverado-2020', 'chevrolet-id', 'brake-pads', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),
('chevrolet-alternator-2', 'Chevrolet Silverado Alternator', 'CSALT001', 'High-output alternator for Chevrolet Silverado. Perfect for additional electrical accessories.', 175.50, NULL, 'REFURBISHED', 'AVAILABLE', 'silverado-2021', 'chevrolet-id', 'alternator', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, datetime('now')),
('chevrolet-radiator-2', 'Chevrolet Silverado Radiator', 'CSRAD001', 'Heavy-duty radiator for Chevrolet Silverado. Aluminum construction for durability.', 145.99, NULL, 'NEW', 'AVAILABLE', 'silverado-2020', 'chevrolet-id', 'radiator', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),

-- More Honda Accord parts
('honda-accord-battery', 'Honda Accord Car Battery', 'HABAT001', 'Premium car battery for Honda Accord. 36-month warranty and excellent cold-cranking amps.', 88.99, NULL, 'NEW', 'AVAILABLE', 'accord-2020', 'honda-id', 'battery', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),
('honda-accord-mirror', 'Honda Accord Side Mirror', 'HAMIR001', 'Power side mirror with defroster for Honda Accord. Easy installation.', 72.50, NULL, 'USED', 'AVAILABLE', 'accord-2021', 'honda-id', 'mirrors', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, datetime('now')),

-- More Toyota Corolla parts
('toyota-corolla-headlight', 'Toyota Corolla Headlight', 'TCHL001', 'OEM headlight assembly for Toyota Corolla. Crystal clear lens and bright output.', 95.99, NULL, 'NEW', 'AVAILABLE', 'corolla-2020', 'toyota-id', 'headlights', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),
('toyota-corolla-spark-plugs', 'Toyota Corolla Spark Plugs', 'TCSP001', 'Set of 4 iridium spark plugs for Toyota Corolla. Improves performance and fuel economy.', 28.99, NULL, 'NEW', 'AVAILABLE', 'corolla-2021', 'toyota-id', 'spark-plugs', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2021, datetime('now')),

-- Ford Mustang parts
('ford-mustang-exhaust', 'Ford Mustang Exhaust System', 'FMEXH001', 'Performance exhaust system for Ford Mustang. Aggressive sound and better performance.', 299.99, NULL, 'NEW', 'AVAILABLE', 'mustang-2020', 'ford-id', 'exhaust', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),
('ford-mustang-air-filter', 'Ford Mustang Air Filter', 'FMAF001', 'High-flow air filter for Ford Mustang. Washable and reusable design.', 35.99, NULL, 'NEW', 'AVAILABLE', 'mustang-2020', 'ford-id', 'air-filter', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),

-- BMW X5 parts
('bmw-x5-brake-rotors', 'BMW X5 Brake Rotors', 'BMX5BR001', 'Premium brake rotors for BMW X5. Cross-drilled for better heat dissipation.', 125.99, NULL, 'NEW', 'AVAILABLE', 'x5-2020', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 'brake-rotors', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now')),
('bmw-x5-windshield', 'BMW X5 Windshield', 'BMX5W001', 'OEM windshield for BMW X5 with rain sensor and heated wiper area.', 399.99, NULL, 'NEW', 'AVAILABLE', 'x5-2020', 'b41e288a-3dd0-4a7e-b420-21633a43b74d', 'windshield', 'cf6cc49b-b8e6-456e-a253-e97558104e72', 'd54b145f-120f-4604-bf06-fa7bd2d13125', 2020, datetime('now'));
