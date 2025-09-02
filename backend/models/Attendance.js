import mongoose from "mongoose";

const Attendance = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    clockIn: {
      type: Date,
    },
    clockOut: {
      type: Date,
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    imageUrl: {
      type: String, // stored image (selfie) path
    },
    status: {
      type: String,
      enum: ["present", "absent", "half-day"],
      default: "present",
    },
  },
  { timestamps: true }
);

export default Attendance;
