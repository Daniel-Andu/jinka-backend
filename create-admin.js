const bcrypt = require('bcryptjs');
const { query } = require('./src/config/db');

async function createAdmin() {
    try {
        console.log('Creating admin user...\n');

        // Hash the password
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        // Create admin role if it doesn't exist
        await query(
            "INSERT INTO roles (name, description) VALUES ('admin', 'Administrator') ON DUPLICATE KEY UPDATE name = name"
        );
        console.log('Admin role created/verified');

        // Get admin role ID
        const roles = await query("SELECT id FROM roles WHERE name = 'admin'");
        const roleId = roles[0].id;

        // Create admin user
        await query(
            `INSERT INTO users (name, email, password, role_id, status) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE password = VALUES(password), role_id = VALUES(role_id)`,
            ['Admin User', 'admin@jinkacity.gov.et', hashedPassword, roleId, 'active']
        );

        console.log('\n✓ Admin user created successfully!');
        console.log('\nLogin credentials:');
        console.log('  Email: admin@jinkacity.gov.et');
        console.log('  Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
