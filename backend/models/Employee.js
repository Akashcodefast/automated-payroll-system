import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String },
  role: { type: String },
  image: { type: String },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
