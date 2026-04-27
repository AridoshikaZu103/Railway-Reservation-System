-- ============================================================
-- Railway Reservation System — Database Schema (ER Diagram Version)
-- Exact Match to Provided ER Diagram
-- ============================================================

DROP TABLE IF EXISTS payment_details CASCADE;
DROP TABLE IF EXISTS passenger_booking CASCADE;
DROP TABLE IF EXISTS train_schedule CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS train CASCADE;
DROP TABLE IF EXISTS station CASCADE;

-- ============================================================
-- 1. STATION TABLE
-- ============================================================
CREATE TABLE station (
    station_id VARCHAR(50) PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    platform_count INT NOT NULL
);

-- ============================================================
-- 2. STAFF TABLE
-- ============================================================
CREATE TABLE staff (
    staff_id VARCHAR(50) PRIMARY KEY,
    staff_name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    station_id VARCHAR(50) REFERENCES station(station_id) ON DELETE CASCADE,
    station_name VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL
);

-- ============================================================
-- 3. TRAIN TABLE
-- ============================================================
CREATE TABLE train (
    train_id VARCHAR(50) PRIMARY KEY,
    train_name VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    source_station VARCHAR(100) NOT NULL,
    destination_station VARCHAR(100) NOT NULL
);

-- ============================================================
-- 4. TRAIN SCHEDULE TABLE (Maps Train to Station)
-- ============================================================
CREATE TABLE train_schedule (
    train_id VARCHAR(50) REFERENCES train(train_id) ON DELETE CASCADE,
    station_id VARCHAR(50) REFERENCES station(station_id) ON DELETE CASCADE,
    station_name VARCHAR(100) NOT NULL,
    arrival_time TIME NOT NULL,
    destination_time TIME NOT NULL,
    day_of_run VARCHAR(50) NOT NULL,
    PRIMARY KEY (train_id, station_id)
);

-- ============================================================
-- 5. PASSENGER BOOKING TABLE
-- ============================================================
CREATE TABLE passenger_booking (
    booking_id VARCHAR(50) PRIMARY KEY,
    passenger_id VARCHAR(50) NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_age INT NOT NULL,
    passenger_gender VARCHAR(20) NOT NULL,
    coach_type VARCHAR(50) NOT NULL,
    train_id VARCHAR(50) REFERENCES train(train_id) ON DELETE CASCADE,
    seat_number INT NOT NULL,
    source_station VARCHAR(100) NOT NULL,
    destination_station VARCHAR(100) NOT NULL,
    ticket_status VARCHAR(50) NOT NULL
);

-- ============================================================
-- 6. PAYMENT DETAILS TABLE
-- ============================================================
CREATE TABLE payment_details (
    payment_id VARCHAR(50) PRIMARY KEY,
    booking_id VARCHAR(50) REFERENCES passenger_booking(booking_id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL CHECK (payment_mode IN ('UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash')),
    booking_status VARCHAR(50) NOT NULL CHECK (booking_status IN ('Confirmed', 'Pending', 'Failed'))
);
