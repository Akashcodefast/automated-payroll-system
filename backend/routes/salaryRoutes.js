import express from "express";
import { getMonthlyReport } from "../controllers/salaryController.js";

const router = express.Router();

// GET /api/salary/report
router.get("/report", getMonthlyReport);


export default router;
