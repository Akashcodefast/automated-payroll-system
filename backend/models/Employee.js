// backend/models/Employee.js

import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
  department: { type: String },
  baseSalary: { type: Number, required: true },
  faceImage: { type: String }, // base64 image from webcam
});

export default mongoose.model("Employee", employeeSchema);
