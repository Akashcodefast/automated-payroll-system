import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Salary from "../models/Salary.js";

// employeeController.js
export const createEmployee = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: "Employee created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: "All employees" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteEmployee = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: "All employees" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getEmployeeById = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: "All employees" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateEmployee = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: "All employees" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dashboard statistics
export const getDashboardStats = async (_req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalSalaries = await Salary.countDocuments();

    return res.json({
      success: true,
      data: { totalEmployees, totalAttendance, totalSalaries },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

// Manage roles
export const manageRoles = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ["admin", "employee", "hr"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${validRoles.join(", ")}`,
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.json({
      success: true,
      message: "Role updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Role update failed",
      error: error.message,
    });
  }
};
