const { query } = require('./src/config/db');

async function fixImageColumns() {
    try {
        console.log('Fixing image column sizes...\n');

        // Fix hero_sliders image column
        console.log('1. Updating hero_sliders.image column...');
        await query('ALTER TABLE hero_sliders MODIFY COLUMN image TEXT');
        console.log('   ✓ hero_sliders.image updated to TEXT\n');

        // Fix news featured_image column
        console.log('2. Updating news.featured_image column...');
        await query('ALTER TABLE news MODIFY COLUMN featured_image TEXT');
        console.log('   ✓ news.featured_image updated to TEXT\n');

        console.log('✓ All image columns updated successfully!');
        console.log('\nYou can now use longer image URLs without errors.');

        process.exit(0);
    } catch (error) {
        console.error('✗ Error fixing image columns:');
        console.error('  Message:', error.message);
        console.error('  Code:', error.code);
        process.exit(1);
    }
}

fixImageColumns();
