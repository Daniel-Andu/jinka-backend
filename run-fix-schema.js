const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runFixSchema() {
    console.log('🔧 Starting schema fix...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: true
        },
        multipleStatements: true
    });

    try {
        console.log('✓ Connected to database');

        // Read the fix schema SQL file
        const sqlFile = path.join(__dirname, 'fix-schema.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('✓ Loaded fix-schema.sql');
        console.log('\n📝 Executing SQL statements...\n');

        // Execute the SQL
        const [results] = await connection.query(sql);

        console.log('✓ Schema fix completed successfully!\n');

        // Show results
        if (Array.isArray(results)) {
            results.forEach((result, index) => {
                if (result && result.length > 0) {
                    console.log(`Result ${index + 1}:`, result);
                }
            });
        }

        console.log('\n✅ All tables and columns have been created/updated!');
        console.log('\n📋 Summary:');
        console.log('   - departments table: CREATED');
        console.log('   - city_stats table: CREATED');
        console.log('   - languages table: CREATED');
        console.log('   - ui_translations table: CREATED');
        console.log('   - subscribers table: CREATED');
        console.log('   - news table: UPDATED (added published_at, is_active)');
        console.log('   - services table: UPDATED (added link, is_active)');
        console.log('\n🎉 Your backend is now ready! All CRUD operations should work.');

    } catch (error) {
        console.error('❌ Error fixing schema:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        await connection.end();
        console.log('\n✓ Database connection closed');
    }
}

runFixSchema();
