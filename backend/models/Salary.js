import mongoose from "mongoose";

const Salary = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: String, // Example: "2025-08"
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    bonuses: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    predictedSalary: {
      type: Number, // future salary prediction (ML model can update this later)
    },
  },
  { timestamps: true }
);

export default Salary;
