const pool = require("../config/db");

/**
 * GET /api/reservations
 * List all reservations (with passenger and train details)
 */
exports.getAll = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.reservation_id, r.booking_date, r.travel_date, r.seat_number, r.status, r.created_at,
        p.passenger_id, p.passenger_name, p.age, p.gender,
        t.train_id, t.train_number, t.train_name, t.source, t.destination, t.fare
      FROM reservations r
      JOIN passengers p ON r.passenger_id = p.passenger_id
      JOIN trains t ON r.train_id = t.train_id
      ORDER BY r.created_at DESC
    `;

    const { rows: reservations } = await pool.query(query);

    res.json({
      success: true,
      data: reservations,
      count: reservations.length,
    });
  } catch (error) {
    console.error("Get reservations error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reservations.",
    });
  }
};

/**
 * POST /api/reservations
 * Create a new reservation (Admin only)
 */
exports.create = async (req, res) => {
  const connection = await pool.connect();
  try {
    const { passenger_id, train_id, travel_date } = req.body;

    if (!passenger_id || !train_id || !travel_date) {
      return res.status(400).json({
        success: false,
        message: "Passenger ID, Train ID, and Travel Date are required.",
      });
    }

    await connection.query("BEGIN");

    // Check if train exists and has available seats
    const { rows: trains } = await connection.query(
      "SELECT total_seats, available_seats FROM trains WHERE train_id = $1 FOR UPDATE",
      [train_id]
    );

    if (trains.length === 0) {
      await connection.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Train not found.",
      });
    }

    const train = trains[0];

    if (train.available_seats <= 0) {
      await connection.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Booking failed. No available seats on this train.",
      });
    }

    // Check if passenger exists
    const { rows: passengers } = await connection.query(
      "SELECT passenger_id FROM passengers WHERE passenger_id = $1",
      [passenger_id]
    );

    if (passengers.length === 0) {
      await connection.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Passenger not found.",
      });
    }

    // Calculate seat number (simple logic: total - available + 1)
    const seat_number = train.total_seats - train.available_seats + 1;
    const booking_date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Insert reservation
    // NOTE: The trigger trg_after_reservation_insert will automatically decrement available_seats
    const { rows: result } = await connection.query(
      `INSERT INTO reservations (passenger_id, train_id, booking_date, travel_date, seat_number, status)
       VALUES ($1, $2, $3, $4, $5, 'confirmed') RETURNING reservation_id`,
      [passenger_id, train_id, booking_date, travel_date, seat_number]
    );

    await connection.query("COMMIT");

    const { rows: newReservation } = await pool.query(
      `SELECT r.*, p.passenger_name, t.train_name, t.train_number 
       FROM reservations r
       JOIN passengers p ON r.passenger_id = p.passenger_id
       JOIN trains t ON r.train_id = t.train_id
       WHERE r.reservation_id = $1`,
      [result[0].reservation_id]
    );

    res.status(201).json({
      success: true,
      message: "Reservation booked successfully.",
      data: newReservation[0],
    });
  } catch (error) {
    await connection.query("ROLLBACK");
    console.error("Create reservation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating reservation.",
    });
  } finally {
    connection.release();
  }
};

/**
 * PATCH /api/reservations/:id/cancel
 * Cancel a reservation (Admin only)
 */
exports.cancel = async (req, res) => {
  try {
    const reservation_id = req.params.id;

    const { rows: existing } = await pool.query(
      "SELECT status FROM reservations WHERE reservation_id = $1",
      [reservation_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    if (existing[0].status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Reservation is already cancelled.",
      });
    }

    // Update status to cancelled
    // NOTE: The trigger trg_after_reservation_cancel will automatically increment available_seats
    await pool.query(
      "UPDATE reservations SET status = 'cancelled' WHERE reservation_id = $1",
      [reservation_id]
    );

    res.json({
      success: true,
      message: "Reservation cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel reservation error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling reservation.",
    });
  }
};
