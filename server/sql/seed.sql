-- ============================================================
-- Railway Reservation System — Seed Data
-- MySQL 8.0+
-- ============================================================

USE railway_reservation;

-- ============================================================
-- Admin User (password: admin123)
-- Hash generated with bcryptjs, 10 rounds
-- ============================================================
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@railway.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin'),
('passenger@railway.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Guest Passenger', 'passenger');

-- ============================================================
-- Sample Trains
-- ============================================================
INSERT INTO trains (train_number, train_name, source, destination, total_seats, available_seats, departure_time, arrival_time, fare) VALUES
('12301', 'Rajdhani Express',    'New Delhi',  'Kolkata',     72, 72, '16:55:00', '09:55:00', 2450.00),
('12951', 'Mumbai Rajdhani',     'New Delhi',  'Mumbai',      72, 72, '16:35:00', '08:35:00', 2855.00),
('12002', 'Shatabdi Express',    'New Delhi',  'Bhopal',     120, 120, '06:15:00', '14:30:00', 1250.00),
('12259', 'Duronto Express',     'Mumbai',     'New Delhi',   72, 72, '23:05:00', '16:25:00', 2690.00),
('12622', 'Tamil Nadu Express',  'New Delhi',  'Chennai',    120, 120, '22:30:00', '07:10:00', 1850.00),
('12723', 'Telangana Express',   'New Delhi',  'Hyderabad',  120, 120, '06:50:00', '05:40:00', 1650.00),
('12432', 'Trivandrum Rajdhani', 'New Delhi',  'Trivandrum',  72, 72, '10:55:00', '05:15:00', 3450.00),
('12313', 'Sealdah Rajdhani',    'New Delhi',  'Sealdah',     72, 72, '14:05:00', '10:10:00', 2350.00),
('12425', 'Jammu Rajdhani',      'New Delhi',  'Jammu Tawi',  72, 72, '20:20:00', '06:00:00', 1550.00),
('12049', 'Gatimaan Express',    'New Delhi',  'Agra',       120, 120, '08:10:00', '09:50:00',  750.00),
('12009', 'Shatabdi Express',    'Mumbai',     'Ahmedabad',  120, 120, '06:20:00', '12:45:00', 1150.00),
('12810', 'Howrah Mail',         'Mumbai',     'Howrah',      72, 72, '21:10:00', '06:15:00', 2100.00),
('12627', 'Karnataka Express',   'Bangalore',  'New Delhi',  120, 120, '19:20:00', '09:00:00', 2300.00),
('12833', 'Howrah Express',      'Ahmedabad',  'Howrah',      72, 72, '00:15:00', '13:30:00', 1800.00),
('12137', 'Punjab Mail',         'Mumbai',     'Firozpur',   120, 120, '19:35:00', '05:10:00', 1600.00),
('12269', 'Duronto Express',     'Chennai',    'New Delhi',   72, 72, '06:35:00', '10:40:00', 2800.00),
('12615', 'Grand Trunk Express', 'Chennai',    'New Delhi',  120, 120, '18:50:00', '06:30:00', 2150.00),
('12559', 'Shiv Ganga Express',  'Varanasi',   'New Delhi',   72, 72, '22:15:00', '08:30:00', 1450.00),
('12311', 'Kalka Mail',          'Howrah',     'Kalka',      120, 120, '19:40:00', '04:30:00', 2050.00),
('12859', 'Gitanjali Express',   'Mumbai',     'Howrah',     120, 120, '06:00:00', '12:30:00', 2000.00),
('22691', 'Rajdhani Express',    'Bangalore',  'New Delhi',   72, 72, '20:00:00', '05:30:00', 3200.00),
('12925', 'Paschim Express',     'Mumbai',     'Amritsar',   120, 120, '11:25:00', '19:20:00', 1950.00),
('12245', 'Howrah Duronto',      'Howrah',     'Bangalore',   72, 72, '10:50:00', '16:00:00', 2600.00),
('12149', 'Pune Express',        'Pune',       'Patna',      120, 120, '20:55:00', '02:15:00', 1850.00),
('12411', 'Gondwana Express',    'Jabalpur',   'New Delhi',  120, 120, '15:00:00', '07:20:00', 1400.00),
('12703', 'Falaknuma Express',   'Howrah',     'Secunderabad',120, 120, '08:35:00', '10:10:00', 1850.00),
('12727', 'Godavari Express',    'Visakhapatnam','Hyderabad', 120, 120, '17:20:00', '05:45:00', 1200.00),
('12759', 'Charminar Express',   'Chennai',    'Hyderabad',  120, 120, '18:10:00', '08:00:00', 1450.00),
('12785', 'Kacheguda Express',   'Bangalore',  'Kacheguda',  120, 120, '18:20:00', '05:40:00', 1300.00),
('12285', 'Secunderabad Duronto','Secunderabad','New Delhi',  72,  72, '12:50:00', '10:40:00', 2900.00),
('17031', 'Hyderabad Express',   'Mumbai',     'Hyderabad',  120, 120, '14:10:00', '05:15:00', 1550.00),
('12302', 'Rajdhani Express',    'Kolkata',    'New Delhi',   72, 72, '09:55:00', '16:55:00', 2450.00),
('12952', 'Mumbai Rajdhani',     'Mumbai',     'New Delhi',   72, 72, '08:35:00', '16:35:00', 2855.00),
('12001', 'Shatabdi Express',    'Bhopal',     'New Delhi',  120, 120, '14:30:00', '06:15:00', 1250.00),
('12260', 'Duronto Express',     'New Delhi',  'Mumbai',      72, 72, '16:25:00', '23:05:00', 2690.00),
('12621', 'Tamil Nadu Express',  'Chennai',    'New Delhi',  120, 120, '07:10:00', '22:30:00', 1850.00),
('12724', 'Telangana Express',   'Hyderabad',  'New Delhi',  120, 120, '05:40:00', '06:50:00', 1650.00),
('12431', 'Trivandrum Rajdhani', 'Trivandrum', 'New Delhi',   72, 72, '05:15:00', '10:55:00', 3450.00),
('12314', 'Sealdah Rajdhani',    'Sealdah',    'New Delhi',   72, 72, '10:10:00', '14:05:00', 2350.00),
('12426', 'Jammu Rajdhani',      'Jammu Tawi', 'New Delhi',   72, 72, '06:00:00', '20:20:00', 1550.00),
('12050', 'Gatimaan Express',    'Agra',       'New Delhi',  120, 120, '09:50:00', '08:10:00',  750.00),
('12010', 'Shatabdi Express',    'Ahmedabad',  'Mumbai',     120, 120, '12:45:00', '06:20:00', 1150.00),
('12809', 'Howrah Mail',         'Howrah',     'Mumbai',      72, 72, '06:15:00', '21:10:00', 2100.00),
('12628', 'Karnataka Express',   'New Delhi',  'Bangalore',  120, 120, '09:00:00', '19:20:00', 2300.00),
('12834', 'Howrah Express',      'Howrah',     'Ahmedabad',   72, 72, '13:30:00', '00:15:00', 1800.00),
('12138', 'Punjab Mail',         'Firozpur',   'Mumbai',     120, 120, '05:10:00', '19:35:00', 1600.00),
('12270', 'Duronto Express',     'New Delhi',  'Chennai',     72, 72, '10:40:00', '06:35:00', 2800.00),
('12616', 'Grand Trunk Express', 'New Delhi',  'Chennai',    120, 120, '06:30:00', '18:50:00', 2150.00),
('12560', 'Shiv Ganga Express',  'New Delhi',  'Varanasi',    72, 72, '08:30:00', '22:15:00', 1450.00),
('12312', 'Kalka Mail',          'Kalka',      'Howrah',     120, 120, '04:30:00', '19:40:00', 2050.00),
('12860', 'Gitanjali Express',   'Howrah',     'Mumbai',     120, 120, '12:30:00', '06:00:00', 2000.00),
('22692', 'Rajdhani Express',    'New Delhi',  'Bangalore',   72, 72, '05:30:00', '20:00:00', 3200.00),
('12926', 'Paschim Express',     'Amritsar',   'Mumbai',     120, 120, '19:20:00', '11:25:00', 1950.00),
('12246', 'Howrah Duronto',      'Bangalore',  'Howrah',      72, 72, '16:00:00', '10:50:00', 2600.00),
('12150', 'Pune Express',        'Patna',      'Pune',       120, 120, '02:15:00', '20:55:00', 1850.00),
('12412', 'Gondwana Express',    'New Delhi',  'Jabalpur',   120, 120, '07:20:00', '15:00:00', 1400.00),
('12704', 'Falaknuma Express',   'Secunderabad','Howrah',    120, 120, '10:10:00', '08:35:00', 1850.00),
('12728', 'Godavari Express',    'Hyderabad',  'Visakhapatnam',120, 120, '05:45:00', '17:20:00', 1200.00),
('12760', 'Charminar Express',   'Hyderabad',  'Chennai',    120, 120, '08:00:00', '18:10:00', 1450.00),
('12786', 'Kacheguda Express',   'Kacheguda',  'Bangalore',  120, 120, '05:40:00', '18:20:00', 1300.00),
('12286', 'Secunderabad Duronto','New Delhi',  'Secunderabad',72,  72, '10:40:00', '12:50:00', 2900.00),
('17032', 'Hyderabad Express',   'Hyderabad',  'Mumbai',     120, 120, '05:15:00', '14:10:00', 1550.00);

-- ============================================================
-- Sample Passengers
-- ============================================================
INSERT INTO passengers (passenger_name, age, gender, contact, email) VALUES
('Aarav Sharma',      28, 'Male',   '9876543210', 'aarav@email.com'),
('Priya Patel',       35, 'Female', '9876543211', 'priya@email.com'),
('Rahul Verma',       42, 'Male',   '9876543212', 'rahul@email.com'),
('Sneha Gupta',       25, 'Female', '9876543213', 'sneha@email.com'),
('Vikram Singh',      55, 'Male',   '9876543214', 'vikram@email.com');

-- ============================================================
-- Sample Reservations (triggers will auto-decrement seats)
-- ============================================================
INSERT INTO reservations (passenger_id, train_id, booking_date, travel_date, seat_number, status) VALUES
(1, 1, '2026-04-25', '2026-05-01', 14, 'confirmed'),
(2, 2, '2026-04-25', '2026-05-02', 22, 'confirmed'),
(3, 1, '2026-04-26', '2026-05-01', 15, 'confirmed');
