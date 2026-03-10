-- Base tables for Jinka CMS
-- Note: Database Jinka_cms already exists, so we skip CREATE DATABASE

USE Jinka_cms;

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120),
    email VARCHAR(120) UNIQUE,
    password VARCHAR(255),
    role_id INT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ROLES
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    description TEXT
);

-- PERMISSIONS
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

-- ROLE PERMISSIONS
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    permission_id INT
);

-- MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    file_type VARCHAR(50),
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(150),
    logo VARCHAR(255),
    favicon VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    youtube VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HERO SLIDER
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

-- LEADERS / MAYOR
CREATE TABLE IF NOT EXISTS leaders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    position VARCHAR(150),
    photo VARCHAR(255),
    message TEXT,
    order_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NEWS
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255),
    content LONGTEXT,
    featured_image VARCHAR(255),
    published_by INT,
    status ENUM('draft','published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATE
);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    icon VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    image VARCHAR(255),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50)
);

-- PAGES
CREATE TABLE IF NOT EXISTS pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255),
    content LONGTEXT,
    featured_image VARCHAR(255),
    created_by INT,
    status ENUM('draft','published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MENUS
CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

-- MENU ITEMS
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    title VARCHAR(120),
    url VARCHAR(255),
    parent_id INT DEFAULT NULL,
    order_number INT
);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120),
    email VARCHAR(120),
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEO
CREATE TABLE IF NOT EXISTS seo_meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_type VARCHAR(50),
    page_id INT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    keywords TEXT
);

-- ACTIVITY LOG
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GALLERY
CREATE TABLE IF NOT EXISTS galleries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gallery_id INT,
    image VARCHAR(255)
);

-- DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    file VARCHAR(255),
    category VARCHAR(100),
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
