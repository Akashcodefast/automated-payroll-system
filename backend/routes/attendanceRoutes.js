import express from "express";
import { markAttendance } from "../controllers/attendanceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee: mark attendance
router.post("/mark", authMiddleware, markAttendance);

export default router;
