const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Connect to the database using the URL in .env
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function runSQLFile(filename) {
  const filePath = path.join(__dirname, "sql", filename);
  console.log(`\n⏳ Running ${filename}...`);
  try {
    const sql = fs.readFileSync(filePath, "utf8");
    await pool.query(sql);
    console.log(`✅ Successfully executed ${filename}`);
  } catch (error) {
    console.error(`❌ Error executing ${filename}:`, error.message);
    throw error;
  }
}

async function setupDatabase() {
  console.log("🚀 Connecting to Vercel Postgres...");
  
  try {
    // 1. Create Tables
    await runSQLFile("schema-postgres.sql");
    
    // 2. Create Triggers
    await runSQLFile("triggers-postgres.sql");
    
    // 3. Insert Seed Data
    await runSQLFile("seed-postgres.sql");

    console.log("\n🎉 Database setup is 100% complete!");
  } catch (error) {
    console.log("\n⚠️ Setup failed. Check the errors above.");
  } finally {
    await pool.end();
  }
}

setupDatabase();
