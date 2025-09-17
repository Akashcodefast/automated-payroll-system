import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

// Get all employees
router.get("/", getEmployees);

// Get employee by ID
router.get("/:id", getEmployeeById);

// Create employee
router.post("/", createEmployee);

// Update employee
router.put("/:id", updateEmployee);

// Delete employee
router.delete("/:id", deleteEmployee);

export default router;
