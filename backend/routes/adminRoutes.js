import express from "express";
import { adminLogin, getDashboardStats,registerAdmin, manageRoles } from "../controllers/adminController.js";
import { verifyAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin login
router.post("/register", registerAdmin);
router.post("/login", adminLogin);

// Protect dashboard & role routes
router.get("/dashboard", verifyAdminToken, getDashboardStats);
router.put("/role/:employeeId", verifyAdminToken, manageRoles);

export default router;
