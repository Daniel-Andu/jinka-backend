const fs = require('fs');
const path = require('path');
const { pool } = require('./src/config/db');

async function runMigrations() {
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    console.log('Running migrations...\n');

    for (const file of files) {
        if (!file.endsWith('.sql')) continue;

        console.log(`Running: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        // Split by semicolon and filter empty statements
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            try {
                await pool.query(statement);
            } catch (error) {
                // Ignore "already exists" errors
                if (!error.message.includes('already exists')) {
                    console.error(`Error in ${file}:`, error.message);
                }
            }
        }

        console.log(`✓ Completed: ${file}\n`);
    }

    console.log('All migrations completed!');
    process.exit(0);
}

runMigrations().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
});
