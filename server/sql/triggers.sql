-- ============================================================
-- Railway Reservation System — Triggers
-- MySQL 8.0+
-- ============================================================

USE railway_reservation;

-- ============================================================
-- TRIGGER 1: Auto-decrement available_seats on confirmed booking
-- ============================================================
DELIMITER //
CREATE TRIGGER trg_after_reservation_insert
AFTER INSERT ON reservations
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' THEN
        UPDATE trains 
        SET available_seats = available_seats - 1
        WHERE train_id = NEW.train_id;
    END IF;
END //
DELIMITER ;

-- ============================================================
-- TRIGGER 2: Restore seat on cancellation
-- ============================================================
DELIMITER //
CREATE TRIGGER trg_after_reservation_cancel
AFTER UPDATE ON reservations
FOR EACH ROW
BEGIN
    IF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
        UPDATE trains 
        SET available_seats = available_seats + 1
        WHERE train_id = NEW.train_id;
    END IF;
END //
DELIMITER ;
