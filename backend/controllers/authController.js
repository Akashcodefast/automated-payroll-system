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
  console.log("hi hi");
  try {
    const { email, password } = req.body;
    const user = await Employee.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    console.log(user);

    res.json({ token: sign(user._id, user.role), user: { id: user._id, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: "Login failed", error: e.message });
  }
};
