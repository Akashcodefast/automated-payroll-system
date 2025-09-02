import express from "express";
import {
  calculateSalary,
  getSalaryByEmployee,
  getAllSalaries,
  predictSalary,
} from "../controllers/salaryController.js";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: calculate salary
router.post("/calculate/:employeeId", authMiddleware, adminMiddleware, calculateSalary);

// Admin: get salary records
router.get("/", authMiddleware, adminMiddleware, getAllSalaries);

// Employee/Admin: view salary details
router.get("/:employeeId", authMiddleware, getSalaryByEmployee);

// ML API: salary prediction
router.post("/predict", authMiddleware, adminMiddleware, predictSalary);

export default router;
