const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * POST /api/auth/register
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;

    // Validate required fields
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and full name are required.",
      });
    }

    // Check if email already exists
    const [existing] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)",
      [email, password_hash, full_name, role || "passenger"]
    );

    const newUser = {
      user_id: result.insertId,
      email,
      full_name,
      role: role || "passenger",
    };

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: { user: newUser, token },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required.",
      });
    }

    // Find user
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify role matches
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Invalid role. This account is not registered as a ${role}.`,
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
};

/**
 * GET /api/auth/me
 * Get current user from token
 */
exports.getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT user_id, email, full_name, role, created_at FROM users WHERE user_id = ?",
      [req.user.user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
