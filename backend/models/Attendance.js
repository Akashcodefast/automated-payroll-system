import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
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
