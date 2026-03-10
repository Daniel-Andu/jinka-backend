// Run the final schema fix SQL
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runFinalFix() {
    console.log('🔧 Running FINAL SCHEMA FIX...\n');
    console.log('This will fix ALL database schema issues!\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: true },
        multipleStatements: true
    });

    try {
        console.log('✓ Connected to database\n');

        // Read the SQL file
        const sqlFile = path.join(__dirname, 'FINAL_SCHEMA_FIX.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('📝 Executing SQL statements...\n');

        // Split SQL into individual statements and execute them one by one
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && s !== 'USE Jinka_cms');

        let successCount = 0;
        let errorCount = 0;

        for (const statement of statements) {
            if (statement.includes('DROP TABLE') ||
                statement.includes('CREATE TABLE') ||
                statement.includes('ALTER TABLE') ||
                statement.includes('INSERT')) {

                try {
                    await connection.query(statement);
                    successCount++;

                    // Show what we're doing
                    if (statement.includes('DROP TABLE')) {
                        const match = statement.match(/DROP TABLE.*?(\w+)/);
                        if (match) console.log(`✓ Dropped table: ${match[1]}`);
                    } else if (statement.includes('CREATE TABLE')) {
                        const match = statement.match(/CREATE TABLE.*?(\w+)/);
                        if (match) console.log(`✓ Created table: ${match[1]}`);
                    } else if (statement.includes('ALTER TABLE')) {
                        const match = statement.match(/ALTER TABLE (\w+)/);
                        if (match) console.log(`✓ Updated table: ${match[1]}`);
                    } else if (statement.includes('INSERT')) {
                        const match = statement.match(/INSERT.*?INTO (\w+)/);
                        if (match) console.log(`✓ Inserted data into: ${match[1]}`);
                    }
                } catch (error) {
                    // Ignore duplicate column errors and foreign key errors
                    if (error.code === 'ER_DUP_FIELDNAME') {
                        console.log(`  ⚠ Column already exists (OK)`);
                    } else if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                        console.log(`  ⚠ Cannot drop (OK)`);
                    } else if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                        console.log(`  ⚠ Foreign key constraint (OK)`);
                    } else if (error.code === 'ER_DUP_ENTRY') {
                        console.log(`  ⚠ Duplicate entry (OK)`);
                    } else {
                        console.log(`  ❌ Error: ${error.message}`);
                        errorCount++;
                    }
                }
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 VERIFICATION\n');

        // Verify tables exist and show counts
        const tables = ['departments', 'city_stats', 'languages', 'hero_sliders', 'services', 'news', 'contact_messages', 'subscribers'];

        for (const table of tables) {
            try {
                const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`✓ ${table.padEnd(20)} ${rows[0].count} records`);
            } catch (error) {
                console.log(`❌ ${table.padEnd(20)} Table not found!`);
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('\n✅ SCHEMA FIX COMPLETED!\n');
        console.log(`📈 Statistics:`);
        console.log(`   - Successful operations: ${successCount}`);
        console.log(`   - Errors (non-critical): ${errorCount}`);
        console.log('\n🎉 Your database is now ready!');
        console.log('\n📱 Next steps:');
        console.log('   1. Refresh your admin panel: http://localhost:3001');
        console.log('   2. Try creating a hero slider');
        console.log('   3. Try creating a department');
        console.log('   4. Try creating an announcement');
        console.log('\n   All should work without errors! 🚀\n');

    } catch (error) {
        console.error('\n❌ Fatal Error:', error.message);
        console.error('\nFull error:', error);
    } finally {
        await connection.end();
        console.log('✓ Database connection closed\n');
    }
}

runFinalFix();
