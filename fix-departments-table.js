// Fix departments table - drop and recreate with correct schema
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDepartmentsTable() {
    console.log('🔧 Fixing departments table schema...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: true }
    });

    try {
        console.log('✓ Connected to database\n');

        // Drop foreign key constraints first
        console.log('Dropping department_translations table...');
        await connection.query('DROP TABLE IF EXISTS department_translations');
        console.log('✓ Translation table dropped\n');

        // Drop the old departments table
        console.log('Dropping old departments table...');
        await connection.query('DROP TABLE IF EXISTS departments');
        console.log('✓ Old table dropped\n');

        // Create new departments table with correct schema
        console.log('Creating new departments table with correct schema...');
        await connection.query(`
            CREATE TABLE departments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                icon VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ New table created\n');

        // Insert sample data
        console.log('Inserting sample departments...');
        await connection.query(`
            INSERT INTO departments (name, description, icon, is_active) VALUES
            ('Civil Registry', 'Birth certificates, ID cards, and civil documentation services', 'BankOutlined', TRUE),
            ('Urban Planning', 'City development, zoning, and construction permits', 'BuildOutlined', TRUE),
            ('Health Services', 'Public health programs and medical services', 'MedicineBoxOutlined', TRUE),
            ('Finance Department', 'Budget management and financial services', 'DollarOutlined', TRUE),
            ('Education', 'Schools, libraries, and educational programs', 'BookOutlined', TRUE)
        `);
        console.log('✓ Sample departments inserted\n');

        // Verify
        const [rows] = await connection.query('SELECT * FROM departments');
        console.log('✅ Success! Departments table fixed.\n');
        console.log(`📊 Total departments: ${rows.length}`);
        console.log('\n🎉 Now try creating/editing/deleting departments in the admin panel!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

fixDepartmentsTable();
