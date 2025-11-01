import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    // 🔹 Store employee email directly (string, not ObjectId)
    employee: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: false, // ✅ added to store name
    },
    department: {
      type: String,
      required: false, // ✅ added to store department
    },
    month: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    predictedSalary: { type: Number },
    hoursWorked: { type: Number, default: 160 },
    leavesTaken: { type: Number, default: 0 },
    experienceYears: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Salary = mongoose.model("Salary", salarySchema);
export default Salary;
