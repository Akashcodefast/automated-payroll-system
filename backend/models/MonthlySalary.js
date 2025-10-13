import mongoose from "mongoose";

const monthlySalarySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  email: { type: String, required: true },
  month: { type: String, required: true }, // e.g., "2025-10"
  baseSalary: { type: Number, required: true },
  predictedSalary: { type: Number, required: true },
  hoursWorked: { type: Number, default: 160 },
  leavesTaken: { type: Number, default: 0 },
  experienceYears: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model("MonthlySalary", monthlySalarySchema);
