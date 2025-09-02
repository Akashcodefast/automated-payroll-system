import express from "express";
import {
  markAttendance,
  getAttendanceByEmployee,
  getAllAttendance,
} from "../controllers/attendanceController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee: mark attendance (image + GPS)
router.post("/mark", authMiddleware, markAttendance);

// Employee/Admin: get attendance by employee
router.get("/:employeeId", authMiddleware, getAttendanceByEmployee);

// Admin only: view all attendance records
router.get("/", authMiddleware, getAllAttendance);

export default router;
