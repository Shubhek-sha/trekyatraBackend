import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //  Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format. Please enter a valid email.",
    });
  }

  try {
    //  Check if email already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed],
    );

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);

    if (rows.length === 0)
      return res.status(401).json({ message: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
  }
};

// PROTECTED PROFILE
export const profile = async (req, res) => {
  res.json({
    message: "Protected profile data",
    user: req.user,
  });
};
