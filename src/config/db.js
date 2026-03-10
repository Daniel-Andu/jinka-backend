// const fs = require("fs");
// const mysql = require("mysql2/promise");
// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// const caPath = process.env.DB_SSL_CA;

// // TiDB Cloud requires SSL
// // If no CA file is provided, use default SSL settings
// const ssl = caPath
//   ? { ca: fs.readFileSync(caPath, "utf8") }
//   : { rejectUnauthorized: true }; // Enable SSL for TiDB Cloud

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT || 4000),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   ssl,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   connectTimeout: 10000 // 10 seconds
// });

// async function query(sql, params = []) {
//   try {
//     const [rows] = await pool.execute(sql, params);
//     return rows;
//   } catch (error) {
//     console.error('Database query error:', {
//       message: error.message,
//       code: error.code,
//       sql: sql.substring(0, 100)
//     });
//     throw error;
//   }
// }

// module.exports = {
//   pool,
//   query
// };




const fs = require("fs");
const mysql = require("mysql2/promise");

// Handle SSL configuration for TiDB Cloud
let ssl;
if (process.env.DB_SSL_CA && process.env.DB_SSL_CA.trim() !== "") {
  // If you provide a CA file path in DB_SSL_CA, load it
  ssl = { ca: fs.readFileSync(process.env.DB_SSL_CA, "utf8") };
} else {
  // Otherwise, just enable SSL with default settings
  ssl = { rejectUnauthorized: true };
}

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 seconds
});

// Query helper
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Database query error:", {
      message: error.message,
      code: error.code,
      sql: sql.substring(0, 100)
    });
    throw error;
  }
}

module.exports = {
  pool,
  query,
  jwtSecret: process.env.JWT_SECRET // ✅ Use JWT_SECRET directly as a string
};

