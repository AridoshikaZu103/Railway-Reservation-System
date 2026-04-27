-- ============================================================
-- Railway Reservation System — Database Schema
-- PostgreSQL Version (For Vercel Postgres)
-- ============================================================

DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS trains CASCADE;
DROP TABLE IF EXISTS passengers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- 1. USERS TABLE (Authentication & RBAC)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id       SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(100) NOT NULL,
    role          VARCHAR(20) DEFAULT 'passenger' CHECK (role IN ('admin', 'passenger')),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for login lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- 2. PASSENGERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS passengers (
    passenger_id   SERIAL PRIMARY KEY,
    passenger_name VARCHAR(100) NOT NULL,
    age            INT NOT NULL CHECK (age > 0 AND age <= 150),
    gender         VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    contact        VARCHAR(15) NOT NULL,
    email          VARCHAR(255),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. TRAINS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS trains (
    train_id        SERIAL PRIMARY KEY,
    train_number    VARCHAR(10) UNIQUE NOT NULL,
    train_name      VARCHAR(100) NOT NULL,
    source          VARCHAR(100) NOT NULL,
    destination     VARCHAR(100) NOT NULL,
    total_seats     INT NOT NULL CHECK (total_seats > 0),
    available_seats INT NOT NULL CHECK (available_seats >= 0),
    departure_time  TIME NOT NULL,
    arrival_time    TIME NOT NULL,
    fare            DECIMAL(10, 2) NOT NULL CHECK (fare > 0),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for frequent searches
CREATE INDEX IF NOT EXISTS idx_trains_number ON trains(train_number);
CREATE INDEX IF NOT EXISTS idx_trains_route ON trains(source, destination);

-- ============================================================
-- 4. RESERVATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id SERIAL PRIMARY KEY,
    passenger_id   INT NOT NULL REFERENCES passengers(passenger_id) ON DELETE CASCADE,
    train_id       INT NOT NULL REFERENCES trains(train_id) ON DELETE RESTRICT,
    booking_date   DATE NOT NULL,
    travel_date    DATE NOT NULL,
    seat_number    INT,
    status         VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlisted')),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for reservation lookups
CREATE INDEX IF NOT EXISTS idx_reservations_passenger ON reservations(passenger_id);
CREATE INDEX IF NOT EXISTS idx_reservations_train ON reservations(train_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
