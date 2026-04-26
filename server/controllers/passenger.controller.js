const pool = require("../config/db");

/**
 * GET /api/passengers
 * List all passengers
 */
exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM passengers";
    let params = [];

    if (search) {
      query +=
        " WHERE passenger_name LIKE ? OR contact LIKE ? OR email LIKE ?";
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm];
    }

    query += " ORDER BY created_at DESC";

    const [passengers] = await pool.query(query, params);

    res.json({
      success: true,
      data: passengers,
      count: passengers.length,
    });
  } catch (error) {
    console.error("Get passengers error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching passengers.",
    });
  }
};

/**
 * GET /api/passengers/:id
 * Get a single passenger by ID
 */
exports.getById = async (req, res) => {
  try {
    const [passengers] = await pool.query(
      "SELECT * FROM passengers WHERE passenger_id = ?",
      [req.params.id]
    );

    if (passengers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found.",
      });
    }

    res.json({
      success: true,
      data: passengers[0],
    });
  } catch (error) {
    console.error("Get passenger error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching passenger.",
    });
  }
};

/**
 * POST /api/passengers
 * Create a new passenger (Admin only)
 */
exports.create = async (req, res) => {
  try {
    const { passenger_name, age, gender, contact, email } = req.body;

    // Validate required fields
    if (!passenger_name || !age || !gender || !contact) {
      return res.status(400).json({
        success: false,
        message: "Name, age, gender, and contact are required.",
      });
    }

    // Validate age
    if (age < 1 || age > 150) {
      return res.status(400).json({
        success: false,
        message: "Age must be between 1 and 150.",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO passengers (passenger_name, age, gender, contact, email) VALUES (?, ?, ?, ?, ?)",
      [passenger_name, age, gender, contact, email || null]
    );

    const [newPassenger] = await pool.query(
      "SELECT * FROM passengers WHERE passenger_id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Passenger registered successfully.",
      data: newPassenger[0],
    });
  } catch (error) {
    console.error("Create passenger error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating passenger.",
    });
  }
};

/**
 * PUT /api/passengers/:id
 * Update passenger information (Admin only)
 */
exports.update = async (req, res) => {
  try {
    const { passenger_name, age, gender, contact, email } = req.body;

    // Check if passenger exists
    const [existing] = await pool.query(
      "SELECT * FROM passengers WHERE passenger_id = ?",
      [req.params.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found.",
      });
    }

    // Validate age if provided
    if (age && (age < 1 || age > 150)) {
      return res.status(400).json({
        success: false,
        message: "Age must be between 1 and 150.",
      });
    }

    await pool.query(
      `UPDATE passengers 
       SET passenger_name = COALESCE(?, passenger_name),
           age = COALESCE(?, age),
           gender = COALESCE(?, gender),
           contact = COALESCE(?, contact),
           email = COALESCE(?, email)
       WHERE passenger_id = ?`,
      [passenger_name, age, gender, contact, email, req.params.id]
    );

    const [updated] = await pool.query(
      "SELECT * FROM passengers WHERE passenger_id = ?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Passenger updated successfully.",
      data: updated[0],
    });
  } catch (error) {
    console.error("Update passenger error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating passenger.",
    });
  }
};

/**
 * DELETE /api/passengers/:id
 * Delete a passenger record (Admin only)
 */
exports.remove = async (req, res) => {
  try {
    const [existing] = await pool.query(
      "SELECT * FROM passengers WHERE passenger_id = ?",
      [req.params.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found.",
      });
    }

    await pool.query("DELETE FROM passengers WHERE passenger_id = ?", [
      req.params.id,
    ]);

    res.json({
      success: true,
      message: "Passenger deleted successfully.",
    });
  } catch (error) {
    console.error("Delete passenger error:", error);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete passenger with active reservations. Cancel reservations first.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting passenger.",
    });
  }
};
