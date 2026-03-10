// Simple script to create missing tables
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runSchemaFix() {
    console.log('🔧 Creating missing database tables...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: true }
    });

    try {
        console.log('✓ Connected to database\n');

        // 1. Create departments table
        console.log('Creating departments table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS departments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                icon VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ departments table created\n');

        // 2. Create city_stats table
        console.log('Creating city_stats table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS city_stats (
                id INT AUTO_INCREMENT PRIMARY KEY,
                stat_key VARCHAR(255) NOT NULL,
                value VARCHAR(255),
                icon VARCHAR(255),
                order_number INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ city_stats table created\n');

        // 3. Create languages table
        console.log('Creating languages table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS languages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(10) NOT NULL UNIQUE,
                name VARCHAR(100) NOT NULL,
                is_default BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ languages table created\n');

        // 4. Create subscribers table
        console.log('Creating subscribers table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS subscribers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(120) UNIQUE NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ subscribers table created\n');

        // 5. Check and add columns to news table
        console.log('Updating news table...');
        try {
            await connection.query('ALTER TABLE news ADD COLUMN published_at TIMESTAMP NULL');
            console.log('✓ Added published_at column to news');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('  published_at column already exists');
            } else {
                console.log('  Warning:', e.message);
            }
        }

        try {
            await connection.query('ALTER TABLE news ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
            console.log('✓ Added is_active column to news');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('  is_active column already exists');
            } else {
                console.log('  Warning:', e.message);
            }
        }
        console.log('');

        // 6. Check and add columns to services table
        console.log('Updating services table...');
        try {
            await connection.query('ALTER TABLE services ADD COLUMN link VARCHAR(255)');
            console.log('✓ Added link column to services');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('  link column already exists');
            } else {
                console.log('  Warning:', e.message);
            }
        }

        try {
            await connection.query('ALTER TABLE services ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
            console.log('✓ Added is_active column to services');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('  is_active column already exists');
            } else {
                console.log('  Warning:', e.message);
            }
        }
        console.log('');

        // 7. Insert default languages
        console.log('Inserting default languages...');
        await connection.query(`
            INSERT IGNORE INTO languages (code, name, is_default, is_active) VALUES
            ('en', 'English', TRUE, TRUE),
            ('am', 'አማርኛ (Amharic)', FALSE, TRUE)
        `);
        console.log('✓ Default languages inserted\n');

        // 8. Insert sample departments
        console.log('Inserting sample departments...');
        await connection.query(`
            INSERT IGNORE INTO departments (name, description, icon, is_active) VALUES
            ('Civil Registry', 'Birth certificates, ID cards, and civil documentation services', 'BankOutlined', TRUE),
            ('Urban Planning', 'City development, zoning, and construction permits', 'BuildOutlined', TRUE),
            ('Health Services', 'Public health programs and medical services', 'MedicineBoxOutlined', TRUE),
            ('Finance Department', 'Budget management and financial services', 'DollarOutlined', TRUE),
            ('Education', 'Schools, libraries, and educational programs', 'BookOutlined', TRUE)
        `);
        console.log('✓ Sample departments inserted\n');

        // 9. Insert sample city stats
        console.log('Inserting sample city stats...');
        await connection.query(`
            INSERT IGNORE INTO city_stats (stat_key, value, icon, order_number, is_active) VALUES
            ('population', '195,000+', 'UserOutlined', 1, TRUE),
            ('area', '250 km²', 'EnvironmentOutlined', 2, TRUE),
            ('departments', '12', 'BankOutlined', 3, TRUE),
            ('services', '50+', 'CustomerServiceOutlined', 4, TRUE)
        `);
        console.log('✓ Sample city stats inserted\n');

        // Verify
        const [deptCount] = await connection.query('SELECT COUNT(*) as count FROM departments');
        const [statsCount] = await connection.query('SELECT COUNT(*) as count FROM city_stats');
        const [langCount] = await connection.query('SELECT COUNT(*) as count FROM languages');

        console.log('✅ Schema fix completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Departments: ${deptCount[0].count} records`);
        console.log(`   - City Stats: ${statsCount[0].count} records`);
        console.log(`   - Languages: ${langCount[0].count} records`);
        console.log('\n🎉 All tables created! Now try creating/deleting items in the admin panel.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nFull error:', error);
    } finally {
        await connection.end();
    }
}

runSchemaFix();
