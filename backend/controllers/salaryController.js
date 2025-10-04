// backend/controllers/salaryController.js
import Salary from "../models/Salary.js";
import axios from "axios";

/**
 * Create Salary Record
 */
export const createSalaryRecord = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      baseSalary,
      bonuses,
      deductions,
      hoursWorked,
      leavesTaken,
      experienceYears,
    } = req.body;

    if (!employeeId || !month || !baseSalary) {
      return res.status(400).json({
        success: false,
        message: "employeeId, month, and baseSalary are required",
      });
    }

    // Validate month format YYYY-MM
    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!monthRegex.test(month)) {
      return res
        .status(400)
        .json({ success: false, message: "Month must be in YYYY-MM format" });
    }

    // Predict salary using ML API
    let predictedSalary = baseSalary;
    try {
      const payload = {
        base_salary: baseSalary,
        hours_worked: hoursWorked || 160,
        leaves_taken: leavesTaken || 0,
        experience_years: experienceYears || 1,
      };

      console.log("📡 Sending data to ML API:", payload);

      const mlRes = await axios.post("http://127.0.0.1:5001/predict", payload, {
        headers: { "Content-Type": "application/json" },
      });

      predictedSalary = mlRes.data.predicted_salary;
    } catch (err) {
      console.error("ML prediction failed:", err.message);
    }

    const netSalary = baseSalary + (bonuses || 0) - (deductions || 0);

    const salary = await Salary.create({
      employee: employeeId,
      month,
      baseSalary,
      bonuses: bonuses || 0,
      deductions: deductions || 0,
      netSalary,
      predictedSalary,
    });

    res.status(201).json({ success: true, data: salary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get Monthly Report
 */
export const getMonthlyReport = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ success: false, message: "Month is required" });
    }

    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!monthRegex.test(month)) {
      return res
        .status(400)
        .json({ success: false, message: "Month must be in YYYY-MM format" });
    }

    const report = await Salary.find({ month }).populate({
      path: "employee",
      select: "name email department",
    });

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch report" });
  }
};

/**
 * Predict Salary
 */
export const predictSalaryController = async (req, res) => {
  try {
    const { baseSalary, hoursWorked, leavesTaken, experienceYears } = req.body;

    if (!baseSalary) {
      return res.status(400).json({ success: false, message: "baseSalary is required" });
    }

    const payload = {
      base_salary: baseSalary,
      hours_worked: hoursWorked || 160,
      leaves_taken: leavesTaken || 0,
      experience_years: experienceYears || 1,
    };

    console.log("📡 Sending data to ML API:", payload);

    const mlRes = await axios.post("http://127.0.0.1:5001/predict", payload, {
      headers: { "Content-Type": "application/json" },
    });

    res.status(200).json({ success: true, predictedSalary: mlRes.data.predicted_salary });
  } catch (err) {
    console.error("ML prediction failed:", err.message);
    res.status(500).json({ success: false, message: "Salary prediction failed" });
  }
};
