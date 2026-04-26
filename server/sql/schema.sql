-- ============================================================
-- Railway Reservation System — Database Schema
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS railway_reservation;
USE railway_reservation;

-- ============================================================
-- 1. USERS TABLE (Authentication & RBAC)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id       INT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(100) NOT NULL,
    role          ENUM('admin', 'passenger') DEFAULT 'passenger',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for login lookups
CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- 2. PASSENGERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS passengers (
    passenger_id   INT AUTO_INCREMENT PRIMARY KEY,
    passenger_name VARCHAR(100) NOT NULL,
    age            INT NOT NULL,
    gender         ENUM('Male', 'Female', 'Other') NOT NULL,
    contact        VARCHAR(15) NOT NULL,
    email          VARCHAR(255),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_passenger_age CHECK (age > 0 AND age <= 150)
);

-- ============================================================
-- 3. TRAINS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS trains (
    train_id        INT AUTO_INCREMENT PRIMARY KEY,
    train_number    VARCHAR(10) UNIQUE NOT NULL,
    train_name      VARCHAR(100) NOT NULL,
    source          VARCHAR(100) NOT NULL,
    destination     VARCHAR(100) NOT NULL,
    total_seats     INT NOT NULL,
    available_seats INT NOT NULL,
    departure_time  TIME NOT NULL,
    arrival_time    TIME NOT NULL,
    fare            DECIMAL(10, 2) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_seats_positive CHECK (total_seats > 0),
    CONSTRAINT chk_seats_available CHECK (available_seats >= 0),
    CONSTRAINT chk_fare_positive CHECK (fare > 0)
);

-- Indexes for frequent searches
CREATE INDEX idx_trains_number ON trains(train_number);
CREATE INDEX idx_trains_route ON trains(source, destination);

-- ============================================================
-- 4. RESERVATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id   INT NOT NULL,
    train_id       INT NOT NULL,
    booking_date   DATE NOT NULL,
    travel_date    DATE NOT NULL,
    seat_number    INT,
    status         ENUM('confirmed', 'cancelled', 'waitlisted') DEFAULT 'confirmed',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE RESTRICT
);

-- Index for reservation lookups
CREATE INDEX idx_reservations_passenger ON reservations(passenger_id);
CREATE INDEX idx_reservations_train ON reservations(train_id);
CREATE INDEX idx_reservations_status ON reservations(status);
