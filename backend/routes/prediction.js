import express from "express";
import axios from "axios";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// Predict salary for a given employee
router.post("/predict-salary/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    // 1. Fetch employee details
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // 2. Calculate features for ML model
    const base_salary = employee.salaryPerMonth;

    const joinDate = new Date(employee.joinDate);
    const currentDate = new Date();
    const experience_years = currentDate.getFullYear() - joinDate.getFullYear();

    // Attendance logic (example – adjust based on your schema)
    const attendance = await Attendance.find({ employee: employeeId });

    const hours_worked = attendance.reduce((sum, a) => sum + (a.hoursWorked || 0), 0);
    const leaves_taken = attendance.filter(a => a.status === "absent").length;

    // 3. Send data to Flask ML model
    const response = await axios.post("http://127.0.0.1:5001/predict", {
      hours_worked,
      leaves_taken,
      experience_years,
      base_salary
    });

    // 4. Send final result back to frontend
    res.json({
      employeeId,
      features: { hours_worked, leaves_taken, experience_years, base_salary },
      predicted_salary: response.data.predicted_salary
    });

  } catch (err) {
    console.error("Prediction error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
