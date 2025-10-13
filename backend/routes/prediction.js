import express from "express";
import axios from "axios";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// ==========================
// Predict salary for a given employee
// ==========================
router.post("/predict-salary/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    // 1️⃣ Fetch employee details
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // 2️⃣ Prepare features for ML model
    const baseSalary = employee.baseSalary ?? 30000; // fallback if missing

    // Experience in years
    const joinDate = employee.joinDate ? new Date(employee.joinDate) : new Date();
    const currentDate = new Date();
    const experienceYears = currentDate.getFullYear() - joinDate.getFullYear();

    // Attendance calculations
    const attendanceRecords = await Attendance.find({ employee: employeeId });

    const hoursWorked = attendanceRecords.reduce(
      (sum, record) => sum + (record.hoursWorked ?? 0),
      0
    );

    const leavesTaken = attendanceRecords.filter(
      (record) => record.status === "absent"
    ).length;

    // 3️⃣ Send features to Flask ML model
    const response = await axios.post("http://127.0.0.1:5001/predict", {
      hours_worked: hoursWorked,
      leaves_taken: leavesTaken,
      experience_years: experienceYears,
      base_salary: baseSalary,
    });

    // 4️⃣ Send result back to frontend
    res.json({
      employeeId,
      features: { hoursWorked, leavesTaken, experienceYears, baseSalary },
      predictedSalary: response.data.predicted_salary,
    });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
