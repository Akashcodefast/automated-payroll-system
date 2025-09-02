import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only: manage employees
router.get("/", authMiddleware, adminMiddleware, getEmployees);
router.get("/:id", authMiddleware, adminMiddleware, getEmployeeById);
router.post("/", authMiddleware, adminMiddleware, createEmployee);
router.put("/:id", authMiddleware, adminMiddleware, updateEmployee);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEmployee);
router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/", deleteEmployee);

export default router;
