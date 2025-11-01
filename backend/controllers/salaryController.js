import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";
import axios from "axios";
import Attendance from "../models/Attendance.js";

/**
 * Create Salary Record (Admin)
 */
export const createSalaryRecord = async (req, res) => {
  try {
    const {
      employeeEmail,
      month,
      baseSalary,
      bonuses,
      deductions,
      hoursWorked,
      leavesTaken,
      experienceYears,
    } = req.body;

    // ✅ Validate input
    if (!employeeEmail || !month || !baseSalary) {
      return res.status(400).json({
        success: false,
        message: "employeeEmail, month, and baseSalary are required",
      });
    }

    // ✅ Fetch employee details from Employee table
    const employeeData = await Employee.findOne({ email: employeeEmail });
    if (!employeeData) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // ✅ Extract employee name & department
    const employeeName = employeeData.name || "Unknown";
    const department = employeeData.department || "Not Assigned";

    // ✅ Predict salary using ML API
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

    // ✅ Calculate net salary
    const netSalary = baseSalary + (bonuses || 0) - (deductions || 0);

    // ✅ Save record with employeeName & department
    const salary = await Salary.create({
      employee: employeeEmail,
      employeeName, // ✅ from Employee collection
      department,   // ✅ from Employee collection
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
    console.error("Error creating salary record:", err.message);
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
      return res.status(400).json({
        success: false,
        message: "Month is required",
      });
    }

    // ✅ Use regex match to handle full date or month-only formats
    const report = await Salary.find({
      month: { $regex: `^${month}` }, // match "2025-11" or "2025-11-01..."
    });

    console.log("Report found:", report.length, "for month:", month);

    // ✅ Return cleaned data
    const formattedReport = report.map((r) => ({
      _id: r._id,
      employeeEmail: r.employee,
      employeeName: r.employeeName,
      department: r.department,
      baseSalary: r.baseSalary,
      predictedSalary: r.predictedSalary,
      netSalary: r.netSalary,
    }));

    res.status(200).json({
      success: true,
      data: formattedReport,
    });
  } catch (err) {
    console.error("Get report error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch salary report",
    });
  }
};



/**
 * Predict Salary by Employee Email
 */
export const predictSalaryController = async (req, res) => {
  try {
    const {
      email,
      baseSalary,
      hoursWorked, // keep this so it still works if frontend sends it
      leavesTaken,
      experienceYears,
      month,
    } = req.body;

    if (!email || !baseSalary) {
      return res.status(400).json({
        success: false,
        message: "email and baseSalary are required",
      });
    }

    // ✅ Find employee
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const salaryMonth = month || new Date().toISOString().slice(0, 7);

    // ✅ Calculate hoursWorked from Attendance collection
    let totalHoursWorked = 0;
    try {
      const [year, monthNum] = salaryMonth.split("-");
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59);

      const attendanceRecords = await Attendance.find({
        employee: email,
        date: { $gte: startDate, $lte: endDate },
      });

      if (attendanceRecords.length > 0) {
        totalHoursWorked = attendanceRecords.reduce(
          (sum, rec) => sum + (rec.totalHours || 0),
          0
        );
      }
    } catch (err) {
      console.error("Attendance fetch failed:", err.message);
    }

    // ✅ Use attendance hours if found, else fallback to provided/default
    const finalHoursWorked =
      totalHoursWorked > 0 ? totalHoursWorked : hoursWorked || 160;

    // ✅ Predict salary using ML API
    const payload = {
      base_salary: baseSalary,
      hours_worked: finalHoursWorked,
      leaves_taken: leavesTaken || 0,
      experience_years: experienceYears || 1,
    };

    let predictedSalary = baseSalary;
    try {
      const mlRes = await axios.post("http://127.0.0.1:5001/predict", payload);
      predictedSalary = Math.max(baseSalary, mlRes.data.predicted_salary);
    } catch (err) {
      console.error("ML prediction failed:", err.message);
    }

    // ✅ Extract employee info
    const employeeName = employee.name || "Unknown";
    const department = employee.department || "Not Assigned";

    // ✅ Save or update record (unchanged)
    let salaryRecord = await Salary.findOne({ employee: email, month: salaryMonth });

    if (salaryRecord) {
      salaryRecord.predictedSalary = predictedSalary;
      salaryRecord.baseSalary = baseSalary;
      salaryRecord.employeeName = employeeName;
      salaryRecord.department = department;
      salaryRecord.hoursWorked = finalHoursWorked;
      salaryRecord.leavesTaken = leavesTaken || 0;
      salaryRecord.experienceYears = experienceYears || 1;
      salaryRecord.netSalary = baseSalary;
      await salaryRecord.save();
    } else {
      salaryRecord = await Salary.create({
        employee: email,
        employeeName,
        department,
        month: salaryMonth,
        baseSalary,
        predictedSalary,
        hoursWorked: finalHoursWorked,
        leavesTaken: leavesTaken || 0,
        experienceYears: experienceYears || 1,
        bonuses: 0,
        deductions: 0,
        netSalary: baseSalary,
      });
    }

    res.status(200).json({ success: true, data: salaryRecord });
  } catch (err) {
    console.error("Salary prediction failed:", err.message);
    res.status(500).json({
      success: false,
      message: "Salary prediction failed",
      error: err.message,
    });
  }
};