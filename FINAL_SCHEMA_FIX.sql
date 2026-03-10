-- ============================================
-- FINAL SCHEMA FIX - RUN THIS IN TIDB CONSOLE
-- ============================================
-- This will fix ALL schema issues and make everything work
-- Copy and paste this entire file into your TiDB console

USE Jinka_cms;

-- Step 1: Drop migration tables that conflict with controller
DROP TABLE IF EXISTS department_translations;
DROP TABLE IF EXISTS service_translations;
DROP TABLE IF EXISTS news_translations;
DROP TABLE IF EXISTS ui_translations;

-- Step 2: Drop and recreate departments table with correct schema
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 3: Create city_stats table
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

-- Step 4: Create languages table
CREATE TABLE IF NOT EXISTS languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 5: Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 6: Update news table (add missing columns if they don't exist)
-- Note: If you get "Duplicate column" errors, that's OK - it means the column already exists
ALTER TABLE news ADD COLUMN published_at TIMESTAMP NULL;
ALTER TABLE news ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Step 7: Update services table (add missing columns if they don't exist)
ALTER TABLE services ADD COLUMN link VARCHAR(255);
ALTER TABLE services ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Step 8: Ensure hero_sliders table exists with correct schema
CREATE TABLE IF NOT EXISTS hero_sliders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    subtitle TEXT,
    image VARCHAR(255),
    button_text VARCHAR(100),
    button_link VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 9: Insert default languages
INSERT IGNORE INTO languages (code, name, is_default, is_active) VALUES
('en', 'English', TRUE, TRUE),
('am', 'አማርኛ (Amharic)', FALSE, TRUE);

-- Step 10: Insert sample departments
INSERT INTO departments (name, description, icon, is_active) VALUES
('Civil Registry', 'Birth certificates, ID cards, and civil documentation services', 'BankOutlined', TRUE),
('Urban Planning', 'City development, zoning, and construction permits', 'BuildOutlined', TRUE),
('Health Services', 'Public health programs and medical services', 'MedicineBoxOutlined', TRUE),
('Finance Department', 'Budget management and financial services', 'DollarOutlined', TRUE),
('Education', 'Schools, libraries, and educational programs', 'BookOutlined', TRUE);

-- Step 11: Insert sample city stats
INSERT INTO city_stats (stat_key, value, icon, order_number, is_active) VALUES
('population', '195,000+', 'UserOutlined', 1, TRUE),
('area', '250 km²', 'EnvironmentOutlined', 2, TRUE),
('departments', '12', 'BankOutlined', 3, TRUE),
('services', '50+', 'CustomerServiceOutlined', 4, TRUE);

-- Step 12: Insert sample hero sliders
INSERT INTO hero_sliders (title, subtitle, image, button_text, button_link, is_active) VALUES
('Welcome to Jinka City', 'Building a better future together', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b', 'Learn More', '/about', TRUE),
('City Services', 'Access all city services online', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', 'View Services', '/services', TRUE),
('Community Events', 'Join us for upcoming community events', 'https://images.unsplash.com/photo-1511578314322-379afb476865', 'See Events', '/events', TRUE);

-- Verification queries
SELECT 'Departments' AS table_name, COUNT(*) AS count FROM departments
UNION ALL
SELECT 'City Stats', COUNT(*) FROM city_stats
UNION ALL
SELECT 'Languages', COUNT(*) FROM languages
UNION ALL
SELECT 'Hero Sliders', COUNT(*) FROM hero_sliders
UNION ALL
SELECT 'Services', COUNT(*) FROM services
UNION ALL
SELECT 'News', COUNT(*) FROM news
UNION ALL
SELECT 'Contact Messages', COUNT(*) FROM contact_messages
UNION ALL
SELECT 'Subscribers', COUNT(*) FROM subscribers;

-- Show table structures to verify
SHOW CREATE TABLE departments;
SHOW CREATE TABLE hero_sliders;
SHOW CREATE TABLE city_stats;
SHOW CREATE TABLE services;
SHOW CREATE TABLE news;
