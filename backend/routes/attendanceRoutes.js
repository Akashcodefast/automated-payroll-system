import express from "express";
import { markAttendance, getMyAttendance } from "../controllers/attendanceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Employee: mark check-in/out
router.post("/mark", authMiddleware, markAttendance);

// 🔹 Employee: fetch attendance logs (latest or monthly)
router.get("/me", authMiddleware, getMyAttendance);

export default router;
