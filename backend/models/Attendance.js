import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  // ✅ store employee email directly instead of ObjectId
  employee: { type: String, required: true },

  date: { type: Date, required: true },
  checkIn: {
    time: Date,
    imageUrl: String,
    location: { latitude: Number, longitude: Number },
  },
  checkOut: {
    time: Date,
    imageUrl: String,
    location: { latitude: Number, longitude: Number },
  },
  totalHours: { type: Number }, // hours worked
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
