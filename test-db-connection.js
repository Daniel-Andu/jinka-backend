const { query } = require('./src/config/db');

async function testConnection() {
    try {
        console.log('Testing database connection...');
        const result = await query('SELECT 1 AS test');
        console.log('✓ Database connection successful!');
        console.log('Test query result:', result[0].test);

        // Test if tables exist
        const tables = await query('SHOW TABLES');
        console.log('\n✓ Tables in database:', tables.length);
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log('  -', tableName);
        });

        // Test hero_sliders table
        const sliders = await query('SELECT COUNT(*) as count FROM hero_sliders');
        console.log('\n✓ Hero sliders count:', sliders[0].count);

        process.exit(0);
    } catch (error) {
        console.error('✗ Database connection failed!');
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        process.exit(1);
    }
}

testConnection();
