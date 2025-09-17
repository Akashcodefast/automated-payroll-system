import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";

// Get all employees (without password)
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    res.json({ success: true, items: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select("-password");
    if (!employee)
      return res.status(404).json({ success: false, message: "Employee not found" });

    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create new employee
export const createEmployee = async (req, res) => {
  try {
    const { name, email, role, department, joinDate, salaryPerMonth, password, faceImage } =
      req.body;

    if (!faceImage)
      return res.status(400).json({ success: false, message: "Face image is required" });

    const exists = await Employee.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      name,
      email,
      role,
      department,
      joinDate,
      salaryPerMonth,
      password: hashedPassword,
      faceImage, // store base64
    });

    await employee.save();

    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!employee)
      return res.status(404).json({ success: false, message: "Employee not found" });

    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee)
      return res.status(404).json({ success: false, message: "Employee not found" });

    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
