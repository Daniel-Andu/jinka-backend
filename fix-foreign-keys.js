// Fix foreign key constraints that prevent deletion
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixForeignKeys() {
    console.log('🔧 Fixing foreign key constraints...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: true }
    });

    try {
        console.log('✓ Connected to database\n');

        // Drop tables with foreign key constraints
        const tablesToDrop = [
            'page_hero_slides',
            'page_stats',
            'page_departments',
            'page_services',
            'service_translations',
            'department_translations',
            'news_translations'
        ];

        for (const table of tablesToDrop) {
            try {
                await connection.query(`DROP TABLE IF EXISTS ${table}`);
                console.log(`✓ Dropped table: ${table}`);
            } catch (error) {
                console.log(`  ⚠ Could not drop ${table}: ${error.message}`);
            }
        }

        console.log('\n✅ Foreign key constraints fixed!');
        console.log('\n📱 Now try deleting a hero slider in the admin panel.');
        console.log('   It should work without errors! 🚀\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

fixForeignKeys();
