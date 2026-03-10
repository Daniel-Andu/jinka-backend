// Test script to insert sample contact messages
// Run this with: node test-contact-form.js

const mysql = require('mysql2/promise');
require('dotenv').config();

const sampleMessages = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Question about Birth Certificate',
        message: 'Hello, I would like to know how to apply for a birth certificate. What documents do I need to bring?'
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        subject: 'Business License Inquiry',
        message: 'I am opening a new restaurant in Jinka. Can you provide information about the business license application process?'
    },
    {
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@example.com',
        subject: 'Road Repair Request',
        message: 'The road on Kebele 03 near the market needs urgent repair. There are large potholes causing problems for vehicles.'
    },
    {
        name: 'Tigist Bekele',
        email: 'tigist.b@example.com',
        subject: 'School Registration',
        message: 'I need to register my child for primary school. What is the deadline and what documents are required?'
    },
    {
        name: 'Michael Smith',
        email: 'michael.smith@example.com',
        subject: 'Property Tax Question',
        message: 'I recently purchased a house in Jinka. How do I pay property tax and what is the rate?'
    },
    {
        name: 'Fatima Ali',
        email: 'fatima.ali@example.com',
        subject: 'Health Services Inquiry',
        message: 'Are there any free health screening programs available for children under 5 years old?'
    },
    {
        name: 'Daniel Tesfaye',
        email: 'daniel.t@example.com',
        subject: 'Complaint about Garbage Collection',
        message: 'Garbage has not been collected in our neighborhood for 2 weeks. Please send the collection truck soon.'
    },
    {
        name: 'Mary Wilson',
        email: 'mary.wilson@example.com',
        subject: 'Event Venue Booking',
        message: 'I would like to book the city hall for a community event on March 25th. Is it available?'
    }
];

async function insertSampleMessages() {
    console.log('📧 Inserting sample contact messages...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: true
        }
    });

    try {
        console.log('✓ Connected to database');

        for (const msg of sampleMessages) {
            await connection.query(
                'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
                [msg.name, msg.email, msg.subject, msg.message]
            );
            console.log(`✓ Inserted message from ${msg.name}`);
        }

        // Count total messages
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM contact_messages');
        console.log(`\n✅ Success! Total messages in database: ${rows[0].count}`);
        console.log('\n📱 Now refresh the Messages page in your admin panel to see them!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

insertSampleMessages();
