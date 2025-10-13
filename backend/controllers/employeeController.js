import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";

// =====================
// Create Employee
// =====================
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, role, baseSalary, faceImage } = req.body;

    // Check if employee already exists
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Employee already exists with this email" });
    }

    const newEmployee = new Employee({
      name,
      email,
      password,
      department,
      role,
      baseSalary, // renamed from salaryPerMonth for consistency
      faceImage,
    });

    await newEmployee.save();
    res.status(201).json({ success: true, message: "Employee created successfully", data: newEmployee });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ success: false, message: "Error creating employee", error: err.message });
  }
};

// =====================
// Get All Employees
// =====================
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ success: true, data: employees });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ success: false, message: "Error fetching employees", error: err.message });
  }
};

// =====================
// Get Single Employee by ID
// =====================
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    console.error("Error fetching employee by ID:", err);
    res.status(500).json({ success: false, message: "Error fetching employee", error: err.message });
  }
};

// =====================
// Get Employee by Email
// =====================
export const getEmployeeByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    console.error("Error fetching employee by email:", err);
    res.status(500).json({ success: false, message: "Error fetching employee by email", error: err.message });
  }
};

// =====================
// Delete Employee
// =====================
export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ success: false, message: "Error deleting employee", error: err.message });
  }
};
