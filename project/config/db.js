import mysql from "mysql2/promise"; // use promise version for async/await

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "shub", // your MySQL password
  database: "trek", // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection with better error handling
pool
  .getConnection()
  .then((conn) => {
    console.log(" MySQL connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error(" DB connection failed:", err.message);
    // Don't exit - the API can still work with delayed DB operations
  });

// Export a query function that handles the connection
const query = async (sql, args = []) => {
  try {
    const connection = await pool.getConnection();
    try {
      const result = await connection.query(sql, args);
      return result;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(" Database Query Error:", error.message);
    console.error("SQL:", sql);
    console.error("Args:", args);
    throw error;
  }
};

export default { query, pool };
