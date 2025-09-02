import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {  
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "employee", "hr"], // you can adjust roles
      default: "employee",
    },
    department: {
      type: String,
      required: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    salaryPerMonth: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true, // will be hashed using bcrypt
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", EmployeeSchema);
