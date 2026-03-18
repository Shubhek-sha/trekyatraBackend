import express from "express";

import {
  registerUser,
  verifyOTP,
  loginUser,
  getProfile,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/verify-otp", verifyOTP);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile);

export default router;
