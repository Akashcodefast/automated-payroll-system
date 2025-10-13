import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import * as faceapi from "face-api.js";
import canvas from "canvas";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config(); // loads FIXED_LAT and FIXED_LNG from .env

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch });

// -------------------------
// Load face models once
// -------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_PATH = path.join(__dirname, "../models/face");

await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

// -------------------------
// Helpers
// -------------------------

// Base64 → Image
const base64ToImage = async (b64) => {
  if (!b64) return null;
  const img = new Image();
  img.src = Buffer.from(b64.split(",")[1], "base64");
  return img;
};

// Compare faces with relaxed threshold
const compareFaces = async (img1Base64, img2Base64) => {
  try {
    const img1 = await base64ToImage(img1Base64);
    const img2 = await base64ToImage(img2Base64);
    if (!img1 || !img2) return false;

    const desc1 = await faceapi.computeFaceDescriptor(img1);
    const desc2 = await faceapi.computeFaceDescriptor(img2);
    if (!desc1 || !desc2) return false;

    const distance = faceapi.euclideanDistance(desc1, desc2);
    console.log("Face distance:", distance.toFixed(4));
    return distance < 0.75; // relaxed threshold
  } catch (err) {
    console.error("Face compare failed:", err.message);
    return false;
  }
};

// Haversine formula to check location
const isLocationValid = (userLoc, allowedRadiusM = 50) => {
  const FIXED_LAT = parseFloat(process.env.FIXED_LAT || "12.984136956511366");
  const FIXED_LNG = parseFloat(process.env.FIXED_LNG || "77.50821149193435");

  if (!userLoc?.latitude || !userLoc?.longitude) return false;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters

  const dLat = toRad(userLoc.latitude - FIXED_LAT);
  const dLon = toRad(userLoc.longitude - FIXED_LNG);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(FIXED_LAT)) *
      Math.cos(toRad(userLoc.latitude)) *
      Math.sin(dLon / 2) ** 2;
  const distance = 2 * R * Math.asin(Math.sqrt(a));
  console.log("Distance from office (m):", distance.toFixed(2));

  return distance <= allowedRadiusM;
};

// -------------------------
// Mark Attendance
// -------------------------
export const markAttendance = async (req, res) => {
  try {
    const { type, imageUrl, location } = req.body;
    if (!type || !location || !imageUrl)
      return res.status(400).json({ message: "Missing required fields" });

    const email = req.user?.email;
    if (!email)
      return res.status(401).json({ message: "Unauthorized: missing email" });

    const employee = await Employee.findOne({ email });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    // ✅ Validate location (allow 100 m for testing auto-checkout)
    if (!isLocationValid(location, 100)) {
      return res.status(401).json({
        message: "❌ Location mismatch. You are not near the office.",
      });
    }

    // ✅ Face verification
    const faceMatch = await compareFaces(employee.faceImage, imageUrl);
    if (!faceMatch) {
      return res.status(401).json({
        message: "❌ Face mismatch. Please try again with better lighting.",
      });
    }

    // ✅ Attendance logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ employee: employee._id, date: today });
    if (!attendance) {
      attendance = new Attendance({ employee: employee._id, date: today, totalHours: 0 });
    }

    const now = new Date();
    if (type === "in") {
      attendance.checkIn = { time: now, imageUrl, location };
    } else if (type === "out") {
      if (!attendance.checkIn?.time)
        return res.status(400).json({ message: "Cannot check-out before check-in" });

      attendance.checkOut = { time: now, imageUrl, location };
      const diffMs = attendance.checkOut.time - attendance.checkIn.time;
      attendance.totalHours = (attendance.totalHours || 0) + diffMs / 1000 / 60 / 60;
    }

    await attendance.save();

    res.status(200).json({
      message: `✅ Attendance ${type} marked successfully.`,
      totalHours: attendance.totalHours,
    });
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ message: "Attendance marking failed", error: err.message });
  }
};

// -------------------------
// Get My Attendance
// -------------------------
export const getMyAttendance = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email)
      return res.status(401).json({ message: "Unauthorized: missing email" });

    const employee = await Employee.findOne({ email });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const { month } = req.query; // format: "YYYY-MM"
    if (!month)
      return res.status(400).json({ message: "Month query param required" });

    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59, 999);

    const records = await Attendance.find({
      employee: employee._id,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    res.status(200).json({ records });
  } catch (err) {
    console.error("Get attendance error:", err);
    res.status(500).json({ message: "Failed to get attendance", error: err.message });
  }
};
