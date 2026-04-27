const { Pool } = require("pg");
require("dotenv").config();

// Use Vercel Postgres URL or fallback to local connection string
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'railway_reservation'}`;

const pool = new Pool({
  connectionString,
  // If connecting to a cloud DB like Vercel, SSL is required:
  ssl: (process.env.POSTGRES_URL || process.env.DATABASE_URL) ? { rejectUnauthorized: false } : false,
  max: 10, // equivalent to connectionLimit
});

// Test connection on startup
pool
  .connect()
  .then((client) => {
    console.log("✅ PostgreSQL connected successfully");
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
  });

module.exports = pool;
