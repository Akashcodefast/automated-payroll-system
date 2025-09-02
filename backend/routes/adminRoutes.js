import express from "express";
import {
  getDashboardStats,
  manageRoles,
} from "../controllers/adminController.js";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin dashboard stats
router.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);

// Admin manage roles (promote/demote employee)
router.put("/roles/:employeeId", authMiddleware, adminMiddleware, manageRoles);

export default router;
