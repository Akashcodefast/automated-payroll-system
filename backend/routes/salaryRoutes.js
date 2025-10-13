import express from "express";
import { createSalaryRecord, getMonthlyReport, predictSalaryController } from "../controllers/salaryController.js";

const router = express.Router();

router.post("/create", createSalaryRecord);
router.get("/report", getMonthlyReport); // GET with query param: ?month=YYYY-MM
router.post("/predict", predictSalaryController); // POST for prediction

export default router;

