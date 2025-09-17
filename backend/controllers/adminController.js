import Admin from "../models/Admin.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Salary from "../models/Salary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Admin login
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: admin._id, role: "admin", email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ message: "Admin registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin", email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get dashboard stats (counts of employees, attendance, salaries)
export const getDashboardStats = async (req, res) => {
  try {
    const employees = await Employee.countDocuments();
    const attendanceRecords = await Attendance.countDocuments();
    const salaries = await Salary.countDocuments();

    res.json({ employees, attendanceRecords, salaries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update employee role (admin/employee)
export const manageRoles = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { role } = req.body;

    if (!["admin", "employee"].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { role: role.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Role updated successfully", employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
