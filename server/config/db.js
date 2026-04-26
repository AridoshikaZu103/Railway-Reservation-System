const mysql = require("mysql2/promise");
require("dotenv").config();

// Allow using a full connection URL (like Railway's MYSQL_URL) or individual variables
const dbConfig = process.env.MYSQL_URL || process.env.DATABASE_URL || {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "railway_reservation",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// Test connection on startup
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection failed:", err.message);
  });

module.exports = pool;
