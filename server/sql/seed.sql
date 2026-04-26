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
('12049', 'Gatimaan Express',    'New Delhi',  'Agra',       120, 120, '08:10:00', '09:50:00',  750.00);

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
