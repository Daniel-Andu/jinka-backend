-- SIMPLE FIX SCHEMA - Run this manually in your database
-- Copy and paste each section one at a time

USE Jinka_cms;

-- 1. Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Create city_stats table
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

-- 3. Create languages table
CREATE TABLE IF NOT EXISTS languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Create ui_translations table
CREATE TABLE IF NOT EXISTS ui_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    language_id INT NOT NULL,
    translation_key VARCHAR(255) NOT NULL,
    translation_value TEXT,
    value_type VARCHAR(50) DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_translation (language_id, translation_key)
);

-- 5. Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Add columns to news table (run these one at a time if you get errors)
-- ALTER TABLE news ADD COLUMN published_at TIMESTAMP NULL AFTER featured_image;
-- ALTER TABLE news ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- 7. Add columns to services table (run these one at a time if you get errors)
-- ALTER TABLE services ADD COLUMN link VARCHAR(255);
-- ALTER TABLE services ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- 8. Insert default languages
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

-- Verify
SELECT 'Departments' AS table_name, COUNT(*) AS count FROM departments
UNION ALL
SELECT 'City Stats', COUNT(*) FROM city_stats
UNION ALL
SELECT 'Languages', COUNT(*) FROM languages
UNION ALL
SELECT 'Subscribers', COUNT(*) FROM subscribers;
