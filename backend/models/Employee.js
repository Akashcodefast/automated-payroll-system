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
      enum: ["admin", "employee", "hr"],
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
      required: true, // hashed using bcrypt
    },
    faceImage: {
      type: String, // store base64 string of face image
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", EmployeeSchema);
