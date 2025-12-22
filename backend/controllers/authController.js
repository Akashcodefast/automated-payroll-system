import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const sign = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, salaryPerMonth } = req.body;
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await Employee.create({
      name,
      email,
      password: hashed,
      role: role || "employee",
      department,
      salaryPerMonth
    });

    res.status(201).json({ token: sign(user._id, user.role), user: { id: user._id, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: "Register failed", error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Debug (visible in Render logs)
    console.log("LOGIN ATTEMPT:", email);

    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
    });
  }
};