const fs = require('fs');
const path = require('path');
const { pool } = require('./src/config/db');

async function runBaseSchema() {
    console.log('Running base schema...\n');

    const sql = fs.readFileSync(path.join(__dirname, 'base-schema.sql'), 'utf8');
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && s !== 'USE Jinka_cms');

    for (const statement of statements) {
        try {
            await pool.query(statement);
        } catch (error) {
            if (!error.message.includes('already exists')) {
                console.error('Error:', error.message);
            }
        }
    }

    console.log('✓ Base schema created!\n');
    process.exit(0);
}

runBaseSchema().catch(error => {
    console.error('Failed:', error);
    process.exit(1);
});
