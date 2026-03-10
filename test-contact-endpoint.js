// Test the public contact endpoint
// Run this with: node test-contact-endpoint.js

const axios = require('axios');

const API_URL = 'http://localhost:5001/api/public';

async function testContactEndpoint() {
    console.log('🧪 Testing Contact Form Endpoint...\n');

    const testMessage = {
        name: 'Test Customer',
        email: 'test@customer.com',
        subject: 'Test Message from Customer Website',
        message: 'This is a test message to verify the contact form is working correctly.'
    };

    try {
        console.log('📤 Sending test message to:', `${API_URL}/contact`);
        console.log('📝 Message data:', testMessage);
        console.log('');

        const response = await axios.post(`${API_URL}/contact`, testMessage, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Success!');
        console.log('📬 Response:', response.data);
        console.log('');
        console.log('🎉 The contact endpoint is working!');
        console.log('📱 Go to your admin panel Messages page to see this message.');
        console.log('   URL: http://localhost:3001/messages');

    } catch (error) {
        console.error('❌ Error testing contact endpoint:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            console.error('No response received. Is the backend running?');
            console.error('Make sure backend is running on http://localhost:5001');
        } else {
            console.error('Error:', error.message);
        }
    }
}

testContactEndpoint();
