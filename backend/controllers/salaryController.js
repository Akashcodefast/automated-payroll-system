import Salary from "../models/Salary.js";
import Attendance from "../models/Attendance.js";
import axios from "axios";

export const calculateSalary = async (req, res) => {
  try {
    const { employeeId, month, baseSalary, deductions = 0, bonuses = 0 } = req.body;

    // Sum worked hours for the month (simple example based on clockIn/clockOut difference)
    const monthStart = new Date(`${month}-01T00:00:00.000Z`);
    const monthEnd = new Date(new Date(monthStart).setMonth(monthStart.getMonth() + 1));

    const logs = await Attendance.find({
      employee: employeeId,
      createdAt: { $gte: monthStart, $lt: monthEnd }
    });

    let totalHours = 0;
    for (const r of logs) {
      if (r.clockIn && r.clockOut) {
        totalHours += (r.clockOut - r.clockIn) / (1000 * 60 * 60);
      }
    }

    const netSalary = baseSalary - deductions + bonuses;
    const doc = await Salary.create({
      employee: employeeId,
      month,
      baseSalary,
      deductions,
      bonuses,
      netSalary
    });

    res.status(201).json({ ...doc.toObject(), totalHours });
  } catch (e) {
    res.status(400).json({ message: "Salary calc failed", error: e.message });
  }
};

export const predictSalary = async (req, res) => {
  try {
    const { experience, total_hours, leave_days, base_salary } = req.body;
    const { data } = await axios.post(process.env.ML_API_URL || "http://localhost:5001/predict", {
      experience,
      total_hours,
      leave_days,
      base_salary
    });
    res.json({ predicted_salary: data.predicted_salary });
  } catch (e) {
    res.status(500).json({ message: "Prediction failed", error: e.message });
  }
};

export const getSalaryByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = await Salary.find({ employee: employeeId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (e) {
    res.status(500).json({ message: "Fetch failed", error: e.message });
  }
};

export const getAllSalaries = async (_req, res) => {
  try {
    const records = await Salary.find().populate("employee", "name email role").sort({ createdAt: -1 });
    res.json(records);
  } catch (e) {
    res.status(500).json({ message: "Fetch failed", error: e.message });
  }
};
