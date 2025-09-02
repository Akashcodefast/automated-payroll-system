import Attendance from "../models/Attendance.js";

// ✅ Mark Attendance (Clock-in / Clock-out)
export const markAttendance = async (req, res) => {
  try {
    const { employeeId, latitude, longitude, type } = req.body;
    const imageUrl = req.file ? `/uploads/attendance/${req.file.filename}` : undefined;

    if (!employeeId || !latitude || !longitude || !type) {
      return res.status(400).json({ message: "All fields (employeeId, location, type) are required" });
    }

    // Get today's date (start & end of day)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Check if employee already has attendance record for today
    let record = await Attendance.findOne({
      employee: employeeId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!record) {
      // ✅ If no record exists, create new one
      record = new Attendance({
        employee: employeeId,
        location: { latitude, longitude },
        imageUrl,
        clockIn: type === "clock-in" ? new Date() : undefined,
        clockOut: type === "clock-out" ? new Date() : undefined
      });
    } else {
      // ✅ If record exists, update it
      if (type === "clock-in" && !record.clockIn) {
        record.clockIn = new Date();
        record.location = { latitude, longitude };
        if (imageUrl) record.imageUrl = imageUrl;
      }
      if (type === "clock-out" && !record.clockOut) {
        record.clockOut = new Date();
        record.location = { latitude, longitude };
        if (imageUrl) record.imageUrl = imageUrl;
      }
    }

    await record.save();
    res.status(200).json({ message: "Attendance updated successfully", record });
  } catch (e) {
    res.status(400).json({ message: "Mark attendance failed", error: e.message });
  }
};

// ✅ Get attendance by Employee
export const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = await Attendance.find({ employee: employeeId })
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (e) {
    res.status(500).json({ message: "Fetch failed", error: e.message });
  }
};

// ✅ Get all attendance (Admin)
export const getAllAttendance = async (_req, res) => {
  try {
    const records = await Attendance.find()
      .populate("employee", "name role email")
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (e) {
    res.status(500).json({ message: "Fetch failed", error: e.message });
  }
};
