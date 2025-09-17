import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

// all employees
router.get("/", getEmployees);

// single employee
router.get("/:id", getEmployeeById);

// create
router.post("/", createEmployee);

// update
router.put("/:id", updateEmployee);

// delete
router.delete("/:id", deleteEmployee);

export default router;
