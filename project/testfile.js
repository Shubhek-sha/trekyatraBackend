import jwt from "jsonwebtoken";

const secret =
  "84e23048619d27647cc9cc9009e1a500fd2faac3fe6946ae7f50ff7bc8d9f4be81651994d5716c58757fcbd1a3f5e1117c924da1a79a2dd66eda03b37984a493 ";

const payload = { id: 1, email: "john@example.com" };

try {
  const token = jwt.sign(payload, secret, { expiresIn: "7d" });
  console.log("JWT Token:", token);

  const decoded = jwt.verify(token, secret);
  console.log("Decoded token:", decoded);
} catch (err) {
  console.error("Error with JWT:", err);
}
