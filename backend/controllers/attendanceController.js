import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import * as faceapi from "face-api.js";
import canvas from "canvas";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_PATH = path.join(__dirname, "../models/face");

// Load face models once
await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

// -------------------------
// Helpers
// -------------------------

const base64ToImage = async (b64) => {
  if (!b64) return null;
  const img = new Image();
  img.src = Buffer.from(b64.split(",")[1], "base64");
  return img;
};

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
    return distance < 0.75;
  } catch (err) {
    console.error("Face compare failed:", err.message);
    return false;
  }
};

// Haversine distance check
// Location validation using Haversine formula (WITH LOGS)
const isLocationValid = (userLoc, allowedRadiusM) => {
  const FIXED_LAT = parseFloat(process.env.FIXED_LAT || "12.9840420");
  const FIXED_LNG = parseFloat(process.env.FIXED_LNG || "77.5084450");

  if (!userLoc?.latitude || !userLoc?.longitude) {
    console.log("❌ Invalid user location received:", userLoc);
    return false;
  }

  // 🛰️ FULL LOCATION LOGS (DO NOT REMOVE)
  console.log("📍 Location Check Details:");
  console.log("--------------------------");
  console.log("✅ Fixed Office Location:", {
    latitude: FIXED_LAT,
    longitude: FIXED_LNG,
  });
  console.log("✅ User Current Location:", {
    latitude: userLoc.latitude,
    longitude: userLoc.longitude,
  });

  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000; // meters

  const dLat = toRad(userLoc.latitude - FIXED_LAT);
  const dLon = toRad(userLoc.longitude - FIXED_LNG);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(FIXED_LAT)) *
      Math.cos(toRad(userLoc.latitude)) *
      Math.sin(dLon / 2) ** 2;

  const distance = 2 * R * Math.asin(Math.sqrt(a));

  console.log("📏 Distance from office (meters):", distance.toFixed(2));
  console.log("✅ Allowed radius (meters):", allowedRadiusM);
  console.log("--------------------------\n");

  return distance <= allowedRadiusM;
};


// -------------------------
// Mark Attendance
// -------------------------
export const markAttendance = async (req, res) => {
  try {
    const { type, imageUrl, location } = req.body;
    const email = req.user?.email;

    if (!type || !imageUrl || !location)
      return res.status(400).json({ message: "Missing required fields" });

    const employee = await Employee.findOne({ email });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    if (!isLocationValid(location, 500))
      return res.status(401).json({ message: "❌ Location mismatch" });

    const faceMatch = await compareFaces(employee.faceImage, imageUrl);
    if (!faceMatch)
      return res.status(401).json({ message: "❌ Face mismatch" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ employee: email, date: today });
    if (!attendance) {
      attendance = new Attendance({
        employee: email,
        date: today,
        totalHours: 0,
      });
    }

    const now = new Date();

    // Check-in
    if (type === "in") {
      attendance.checkIn = { time: now, imageUrl, location };
      attendance.checkOut = null;
      if (!attendance.totalHours) attendance.totalHours = 0;
    }

    // Check-out
    if (type === "out") {
      if (!attendance.checkIn?.time)
        return res.status(400).json({ message: "Check-in required" });

      attendance.checkOut = { time: now, imageUrl, location };
      const diffMs = now - attendance.checkIn.time;
      const sessionHours = diffMs / 1000 / 60 / 60;
      attendance.totalHours = (attendance.totalHours || 0) + sessionHours;
    }

    await attendance.save();

    res.json({
      success: true,
      data: attendance,
      message: `Attendance ${type} successful`,
    });
  } catch (err) {
    console.error("❌ Attendance error:", err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

// -------------------------
// Get My Attendance
// -------------------------
export const getMyAttendance = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ message: "Unauthorized" });

    const records = await Attendance.find({ employee: email })
      .sort({ date: -1 })
      .lean();

    if (!records.length)
      return res.status(200).json({ success: true, data: [], message: "No attendance logs found" });

    const latest = records[0];
    res.status(200).json({
      success: true,
      data: {
        date: latest.date,
        checkIn: latest.checkIn,
        checkOut: latest.checkOut,
        totalHours: latest.totalHours || 0,
      },
      message: "Latest attendance fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch attendance", error: err.message });
  }
};
