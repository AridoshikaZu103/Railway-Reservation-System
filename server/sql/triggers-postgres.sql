-- ============================================================
-- Railway Reservation System — Triggers
-- PostgreSQL Version
-- ============================================================

-- ============================================================
-- TRIGGER 1: Auto-decrement available_seats on confirmed booking
-- ============================================================
CREATE OR REPLACE FUNCTION decrement_available_seats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' THEN
        UPDATE trains 
        SET available_seats = available_seats - 1
        WHERE train_id = NEW.train_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_after_reservation_insert ON reservations;
CREATE TRIGGER trg_after_reservation_insert
AFTER INSERT ON reservations
FOR EACH ROW
EXECUTE FUNCTION decrement_available_seats();

-- ============================================================
-- TRIGGER 2: Restore seat on cancellation
-- ============================================================
CREATE OR REPLACE FUNCTION restore_available_seats()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
        UPDATE trains 
        SET available_seats = available_seats + 1
        WHERE train_id = NEW.train_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_after_reservation_cancel ON reservations;
CREATE TRIGGER trg_after_reservation_cancel
AFTER UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION restore_available_seats();
