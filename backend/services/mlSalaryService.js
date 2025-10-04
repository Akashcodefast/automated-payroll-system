// services/mlSalaryService.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ✅ Point this to your actual Flask ML API URL
const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:5001/predict";

export const predictSalary = async (payload) => {
  try {
    console.log("📡 Sending data to ML API:", payload);

    // Ensure correct JSON format and headers
    const { data } = await axios.post(ML_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000, // 10s timeout
    });

    console.log("✅ ML API response:", data);

    // Handle different Flask response formats
    return data.predictedSalary || data.predicted_salary || data.result || 0;
  } catch (err) {
    console.error("Error calling ML API:", err.message);
    throw new Error("Salary prediction failed");
  }
};
