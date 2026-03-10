const axios = require('axios');

async function testHeroSlider() {
    try {
        // First login to get token
        console.log('1. Testing login...');
        const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'admin@jinkacity.gov.et',
            password: 'admin123'
        });

        const token = loginRes.data.token;
        console.log('✓ Login successful\n');

        // Test create hero slider
        console.log('2. Testing create hero slider...');
        const createData = {
            title: 'Test Slider ' + Date.now(),
            subtitle: 'Test subtitle',
            image: 'https://example.com/test.jpg',
            button_text: 'Click Me',
            button_link: '/test',
            is_active: true
        };

        const createRes = await axios.post('http://localhost:5001/api/admin/hero-sliders', createData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✓ Create response:', JSON.stringify(createRes.data, null, 2));
        console.log('');

        // Test get all
        console.log('3. Testing get all hero sliders...');
        const getRes = await axios.get('http://localhost:5001/api/admin/hero-sliders', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✓ Get all response (count):', getRes.data.length);
        console.log('✓ Latest slider:', JSON.stringify(getRes.data[getRes.data.length - 1], null, 2));

    } catch (error) {
        console.error('✗ Error:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

testHeroSlider();
