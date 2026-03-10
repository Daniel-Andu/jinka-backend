-- Insert sample contact messages for testing
USE Jinka_cms;

INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES
('John Doe', 'john.doe@example.com', 'Question about Birth Certificate', 'Hello, I would like to know how to apply for a birth certificate. What documents do I need to bring?', NOW()),
('Sarah Johnson', 'sarah.j@example.com', 'Business License Inquiry', 'I am opening a new restaurant in Jinka. Can you provide information about the business license application process?', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Ahmed Hassan', 'ahmed.hassan@example.com', 'Road Repair Request', 'The road on Kebele 03 near the market needs urgent repair. There are large potholes causing problems for vehicles.', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Tigist Bekele', 'tigist.b@example.com', 'School Registration', 'I need to register my child for primary school. What is the deadline and what documents are required?', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('Michael Smith', 'michael.smith@example.com', 'Property Tax Question', 'I recently purchased a house in Jinka. How do I pay property tax and what is the rate?', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Fatima Ali', 'fatima.ali@example.com', 'Health Services Inquiry', 'Are there any free health screening programs available for children under 5 years old?', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
('Daniel Tesfaye', 'daniel.t@example.com', 'Complaint about Garbage Collection', 'Garbage has not been collected in our neighborhood for 2 weeks. Please send the collection truck soon.', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Mary Wilson', 'mary.wilson@example.com', 'Event Venue Booking', 'I would like to book the city hall for a community event on March 25th. Is it available?', DATE_SUB(NOW(), INTERVAL 4 HOUR));

-- Verify the messages were inserted
SELECT COUNT(*) as total_messages FROM contact_messages;
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5;
