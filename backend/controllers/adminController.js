import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Salary from "../models/Salary.js";

// Get counts of employees, attendance records, and salary documents for dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // Counting total employees
    const employees = await Employee.countDocuments();

    // Counting attendance logs
    const attendanceRecords = await Attendance.countDocuments();

    // Counting salary records
    const salaries = await Salary.countDocuments();

    res.json({
      employees,
      attendanceRecords,
      salaries,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Role management - update an employee's role (admin/employee)
export const manageRoles = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { role } = req.body;

    // Validate role input if needed
    if (!["admin", "employee"].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Find employee and update role atomically
    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { role: role.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Role updated successfully", employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
