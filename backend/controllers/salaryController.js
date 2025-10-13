// backend/controllers/salaryController.js
import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js"; // ✅ Import Employee model
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

    // Predict salary using ML API
    let predictedSalary = baseSalary;
    try {
      const payload = {
        base_salary: baseSalary,
        hours_worked: hoursWorked || 160,
        leaves_taken: leavesTaken || 0,
        experience_years: experienceYears || 1,
      };

      const mlRes = await axios.post("http://127.0.0.1:5001/predict", payload);
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
      hoursWorked: hoursWorked || 160,
      leavesTaken: leavesTaken || 0,
      experienceYears: experienceYears || 1,
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
 * Predict Salary by Email & Save
 */
export const predictSalaryController = async (req, res) => {
  try {
    const { email, baseSalary, hoursWorked, leavesTaken, experienceYears, month } = req.body;

    if (!email || !baseSalary) {
      return res.status(400).json({ success: false, message: "email and baseSalary are required" });
    }

    // ✅ Find employee by email
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const salaryMonth = month || new Date().toISOString().slice(0, 7);

    // ML prediction payload
    const payload = {
      base_salary: baseSalary,
      hours_worked: hoursWorked || 160,
      leaves_taken: leavesTaken || 0,
      experience_years: experienceYears || 1,
    };

    const mlRes = await axios.post("http://127.0.0.1:5001/predict", payload);
    const predictedSalary = Math.max(baseSalary, mlRes.data.predicted_salary);


    // Save or update salary record
    let salaryRecord = await Salary.findOne({ employee: employee._id, month: salaryMonth });
    if (salaryRecord) {
      salaryRecord.predictedSalary = predictedSalary;
      salaryRecord = await salaryRecord.save();
    } else {
      salaryRecord = await Salary.create({
        employee: employee._id,
        month: salaryMonth,
        baseSalary,
        predictedSalary,
        hoursWorked: payload.hours_worked,
        leavesTaken: payload.leaves_taken,
        experienceYears: payload.experience_years,
        bonuses: 0,
        deductions: 0,
        netSalary: baseSalary,
      });
    }

    res.status(200).json({ success: true, data: salaryRecord });
  } catch (err) {
    console.error("Salary prediction failed:", err.message);
    res.status(500).json({ success: false, message: "Salary prediction failed", error: err.message });
  }
};
