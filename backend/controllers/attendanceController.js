import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import * as faceapi from "face-api.js";
import canvas from "canvas";
import fetch from "node-fetch"; // needed for face-api.js
import path from "path";
import { fileURLToPath } from "url";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch });

// Load models (call this once at server start)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_PATH = path.join(__dirname, "../models/face"); // folder where face-api models are stored

await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

/**
 * Convert Base64 string to Canvas Image
 */
const base64ToImage = async (b64) => {
  if (!b64) return null;
  const img = new Image();
  img.src = Buffer.from(b64.split(",")[1], "base64");
  return img;
};

/**
 * Compare two face images using embeddings
 * Returns true if similarity > threshold
 */
const compareFaces = async (img1Base64, img2Base64) => {
  const img1 = await base64ToImage(img1Base64);
  const img2 = await base64ToImage(img2Base64);

  if (!img1 || !img2) return false;

  const desc1 = await faceapi.computeFaceDescriptor(img1);
  const desc2 = await faceapi.computeFaceDescriptor(img2);

  if (!desc1 || !desc2) return false;

  const distance = faceapi.euclideanDistance(desc1, desc2);
  return distance < 0.6; // threshold for same face
};

export const markAttendance = async (req, res) => {
  try {
    const { type, imageUrl, location } = req.body;
    if (!type || !location || !imageUrl)
      return res.status(400).json({ message: "Missing required fields" });

    const email = req.user?.email;
    if (!email) return res.status(401).json({ message: "Unauthorized: missing email" });

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Face verification
    const faceMatch = await compareFaces(employee.faceImage, imageUrl);
    if (!faceMatch) return res.status(401).json({ message: "Face mismatch! Attendance denied." });

    // Today's date (reset time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      employee: employee._id,
      date: today,
    });

    if (!attendance) {
      attendance = new Attendance({
        employee: employee._id,
        date: today,
        totalHours: 0,
      });
    }

    const now = new Date();

    if (type === "in") {
      attendance.checkIn = { time: now, imageUrl, location };
    } else if (type === "out") {
      if (!attendance.checkIn || !attendance.checkIn.time) {
        return res.status(400).json({ message: "Cannot check-out before check-in" });
      }
      attendance.checkOut = { time: now, imageUrl, location };

      // Calculate hours
      const diffMs = attendance.checkOut.time - attendance.checkIn.time;
      attendance.totalHours = (attendance.totalHours || 0) + diffMs / 1000 / 60 / 60;
    }

    await attendance.save();

    res.status(200).json({
      message: `Attendance ${type} marked successfully`,
      totalHours: attendance.totalHours,
    });
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ message: "Attendance marking failed", error: err.message });
  }
};
