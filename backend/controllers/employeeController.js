// backend/controllers/employeeController.js

import Employee from "../models/Employee.js";

// ✅ Create Employee
export const createEmployee = async (req, res) => {
  try {
    const { name, email, department, role } = req.body;
    const newEmployee = new Employee({ name, email, department, role });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: "Error creating employee", error: err.message });
  }
};

// ✅ Get All Employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
};

// ✅ Get Single Employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
};

// ✅ Get Employee by Email
export const getEmployeeByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee by email", error: err.message });
  }
};

// ✅ Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee", error: err.message });
  }
};
