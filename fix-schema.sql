-- FIX SCHEMA TO MATCH ADMIN CONTROLLER EXPECTATIONS
-- Run this script to add missing tables and columns
-- This will make all CRUD operations work correctly

USE Jinka_cms;

-- 1. Add departments table (MISSING)
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Add city_stats table (MISSING)
CREATE TABLE IF NOT EXISTS city_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_key VARCHAR(255) NOT NULL,
    value VARCHAR(255),
    icon VARCHAR(255),
    order_number INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Add languages table (MISSING)
CREATE TABLE IF NOT EXISTS languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Add ui_translations table (MISSING)
CREATE TABLE IF NOT EXISTS ui_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    language_id INT NOT NULL,
    translation_key VARCHAR(255) NOT NULL,
    translation_value TEXT,
    value_type VARCHAR(50) DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    UNIQUE KEY unique_translation (language_id, translation_key)
);

-- 5. Add subscribers table (MISSING)
CREATE TABLE IF NOT EXISTS subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Alter news table to add missing columns
-- Check if columns exist before adding
SET @exist_published_at := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'Jinka_cms' AND TABLE_NAME = 'news' AND COLUMN_NAME = 'published_at');
SET @exist_is_active_news := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'Jinka_cms' AND TABLE_NAME = 'news' AND COLUMN_NAME = 'is_active');

SET @sql_published_at = IF(@exist_published_at = 0, 
    'ALTER TABLE news ADD COLUMN published_at TIMESTAMP NULL AFTER featured_image', 
    'SELECT "Column published_at already exists" AS message');
SET @sql_is_active_news = IF(@exist_is_active_news = 0, 
    'ALTER TABLE news ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER published_at', 
    'SELECT "Column is_active already exists" AS message');

PREPARE stmt1 FROM @sql_published_at;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

PREPARE stmt2 FROM @sql_is_active_news;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- 7. Alter services table to add missing columns
SET @exist_link := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'Jinka_cms' AND TABLE_NAME = 'services' AND COLUMN_NAME = 'link');
SET @exist_is_active_services := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'Jinka_cms' AND TABLE_NAME = 'services' AND COLUMN_NAME = 'is_active');

SET @sql_link = IF(@exist_link = 0, 
    'ALTER TABLE services ADD COLUMN link VARCHAR(255) AFTER icon', 
    'SELECT "Column link already exists" AS message');
SET @sql_is_active_services = IF(@exist_is_active_services = 0, 
    'ALTER TABLE services ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER link', 
    'SELECT "Column is_active already exists" AS message');

PREPARE stmt3 FROM @sql_link;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

PREPARE stmt4 FROM @sql_is_active_services;
EXECUTE stmt4;
DEALLOCATE PREPARE stmt4;

-- 8. Insert default languages (English and Amharic)
INSERT IGNORE INTO languages (code, name, is_default, is_active) VALUES
('en', 'English', TRUE, TRUE),
('am', 'አማርኛ (Amharic)', FALSE, TRUE);

-- 9. Insert sample departments
INSERT IGNORE INTO departments (name, description, icon, is_active) VALUES
('Civil Registry', 'Birth certificates, ID cards, and civil documentation services', 'BankOutlined', TRUE),
('Urban Planning', 'City development, zoning, and construction permits', 'BuildOutlined', TRUE),
('Health Services', 'Public health programs and medical services', 'MedicineBoxOutlined', TRUE),
('Finance Department', 'Budget management and financial services', 'DollarOutlined', TRUE),
('Education', 'Schools, libraries, and educational programs', 'BookOutlined', TRUE);

-- 10. Insert sample city stats
INSERT IGNORE INTO city_stats (stat_key, value, icon, order_number, is_active) VALUES
('population', '195,000+', 'UserOutlined', 1, TRUE),
('area', '250 km²', 'EnvironmentOutlined', 2, TRUE),
('departments', '12', 'BankOutlined', 3, TRUE),
('services', '50+', 'CustomerServiceOutlined', 4, TRUE);

-- Verification queries
SELECT 'Departments table created' AS status, COUNT(*) AS count FROM departments;
SELECT 'City Stats table created' AS status, COUNT(*) AS count FROM city_stats;
SELECT 'Languages table created' AS status, COUNT(*) AS count FROM languages;
SELECT 'UI Translations table created' AS status, COUNT(*) AS count FROM ui_translations;
SELECT 'Subscribers table created' AS status, COUNT(*) AS count FROM subscribers;
SELECT 'News table updated' AS status, COUNT(*) AS count FROM news;
SELECT 'Services table updated' AS status, COUNT(*) AS count FROM services;

-- Show table structures
SHOW CREATE TABLE departments;
SHOW CREATE TABLE news;
SHOW CREATE TABLE services;
