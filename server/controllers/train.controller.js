const pool = require("../config/db");

/**
 * GET /api/trains
 * List all trains
 */
exports.getAll = async (req, res) => {
  try {
    const [trains] = await pool.query(
      "SELECT * FROM trains ORDER BY train_number ASC"
    );

    res.json({
      success: true,
      data: trains,
      count: trains.length,
    });
  } catch (error) {
    console.error("Get trains error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching trains.",
    });
  }
};

/**
 * GET /api/trains/search?source=X&destination=Y
 * Search trains by route
 */
exports.search = async (req, res) => {
  try {
    const { source, destination, train_number } = req.query;

    let query = "SELECT * FROM trains WHERE 1=1";
    let params = [];

    if (train_number) {
      query += " AND train_number = ?";
      params.push(train_number);
    }

    if (source) {
      query += " AND LOWER(source) LIKE LOWER(?)";
      params.push(`%${source}%`);
    }

    if (destination) {
      query += " AND LOWER(destination) LIKE LOWER(?)";
      params.push(`%${destination}%`);
    }

    query += " ORDER BY departure_time ASC";

    const [trains] = await pool.query(query, params);

    res.json({
      success: true,
      data: trains,
      count: trains.length,
    });
  } catch (error) {
    console.error("Search trains error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching trains.",
    });
  }
};

/**
 * GET /api/trains/:id
 * Get a single train by ID
 */
exports.getById = async (req, res) => {
  try {
    const [trains] = await pool.query(
      "SELECT * FROM trains WHERE train_id = ?",
      [req.params.id]
    );

    if (trains.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Train not found.",
      });
    }

    res.json({
      success: true,
      data: trains[0],
    });
  } catch (error) {
    console.error("Get train error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching train.",
    });
  }
};

/**
 * POST /api/trains
 * Add a new train (Admin only)
 */
exports.create = async (req, res) => {
  try {
    const {
      train_number,
      train_name,
      source,
      destination,
      total_seats,
      departure_time,
      arrival_time,
      fare,
    } = req.body;

    // Validate required fields
    if (
      !train_number ||
      !train_name ||
      !source ||
      !destination ||
      !total_seats ||
      !departure_time ||
      !arrival_time ||
      !fare
    ) {
      return res.status(400).json({
        success: false,
        message: "All train fields are required.",
      });
    }

    // Check for duplicate train number
    const [existing] = await pool.query(
      "SELECT train_id FROM trains WHERE train_number = ?",
      [train_number]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A train with this number already exists.",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO trains (train_number, train_name, source, destination, total_seats, available_seats, departure_time, arrival_time, fare)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        train_number,
        train_name,
        source,
        destination,
        total_seats,
        total_seats, // available_seats starts equal to total_seats
        departure_time,
        arrival_time,
        fare,
      ]
    );

    const [newTrain] = await pool.query(
      "SELECT * FROM trains WHERE train_id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Train added successfully.",
      data: newTrain[0],
    });
  } catch (error) {
    console.error("Create train error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding train.",
    });
  }
};

/**
 * PUT /api/trains/:id
 * Update train information (Admin only)
 */
exports.update = async (req, res) => {
  try {
    const {
      train_name,
      source,
      destination,
      total_seats,
      available_seats,
      departure_time,
      arrival_time,
      fare,
    } = req.body;

    const [existing] = await pool.query(
      "SELECT * FROM trains WHERE train_id = ?",
      [req.params.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Train not found.",
      });
    }

    await pool.query(
      `UPDATE trains 
       SET train_name = COALESCE(?, train_name),
           source = COALESCE(?, source),
           destination = COALESCE(?, destination),
           total_seats = COALESCE(?, total_seats),
           available_seats = COALESCE(?, available_seats),
           departure_time = COALESCE(?, departure_time),
           arrival_time = COALESCE(?, arrival_time),
           fare = COALESCE(?, fare)
       WHERE train_id = ?`,
      [
        train_name,
        source,
        destination,
        total_seats,
        available_seats,
        departure_time,
        arrival_time,
        fare,
        req.params.id,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM trains WHERE train_id = ?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Train updated successfully.",
      data: updated[0],
    });
  } catch (error) {
    console.error("Update train error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating train.",
    });
  }
};

/**
 * DELETE /api/trains/:id
 * Delete a train (Admin only)
 */
exports.remove = async (req, res) => {
  try {
    const [existing] = await pool.query(
      "SELECT * FROM trains WHERE train_id = ?",
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Train not found.",
      });
    }

    await pool.query("DELETE FROM trains WHERE train_id = ?", [req.params.id]);

    res.json({
      success: true,
      message: "Train deleted successfully.",
    });
  } catch (error) {
    console.error("Delete train error:", error);
    // Handle foreign key constraint error if reservations exist
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        success: false,
        message: "Cannot delete this train because passenger reservations are attached to it.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting train.",
    });
  }
};
