import mysql from "mysql2/promise"; // use promise version for async/await

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "shub", // your MySQL password
  database: "trek", // your database name
});

// Test connection
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });

export default pool;
