import db from "../config/db.js";

// Create user
export const createUser = async (user) => {
  const query = `
  INSERT INTO users(
    email,
    password_hash,
    full_name,
    username,
    profile_picture,
    phone,
    date_of_birth,
    fitness_level,
    preferred_difficulty,
    preferred_max_duration,
    location_country,
    location_city,
    bio
  )
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const values = [
    user.email,
    user.password_hash,
    user.full_name,
    user.username,
    user.profile_picture,
    user.phone,
    user.date_of_birth,
    user.fitness_level,
    user.preferred_difficulty,
    user.preferred_max_duration,
    user.location_country,
    user.location_city,
    user.bio,
  ];

  const [result] = await db.query(query, values);
  return result;
};

// Find user by email
export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);

  return rows[0];
};

// Find user by id
export const findUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE user_id=?", [id]);

  return rows[0];
};

//update user by email
export const updateUserByEmail = async (email, updateData) => {
  const fields = Object.keys(updateData)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(updateData);

  const sql = `UPDATE users SET ${fields} WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [...values, email], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

