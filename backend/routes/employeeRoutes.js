// backend/routes/employeeRoutes.js
import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmail,  // ✅ import the new function
  deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/", createEmployee);        // Create employee
router.get("/", getAllEmployees);        // Get all employees
router.get("/:id", getEmployeeById);     // Get one employee by ID
router.get("/email/:email", getEmployeeByEmail); // ✅ Get employee by email
router.delete("/:id", deleteEmployee);   // Delete employee by ID

export default router;
