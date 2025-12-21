import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

export default function Register() {
const baseURL = process.env.REACT_APP_API_BASE || "https://automated-payroll-system.onrender.com";

  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
    baseSalary: "", // ✅ Correct field
    faceImage: "",
  });

  const [showWebcam, setShowWebcam] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFormData((prev) => ({ ...prev, faceImage: imageSrc }));
    alert("Face captured successfully!");
    setShowWebcam(false);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Convert salary to number to match backend schema
    const payload = {
      ...formData,
      baseSalary: Number(formData.baseSalary),
    };
    try {
  const res = await axios.post(`${baseURL}/api/employee`, payload);
  // Ignore any token in response
  if (res.data.token) delete res.data.token;

  if (res.data.success) {
    alert("Employee added successfully!");
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "employee",
      department: "",
      baseSalary: "",
      faceImage: "",
    });
    
  } else {
    alert(res.data.message || "Error adding employee");
  }
} catch (err) {
  console.error("Error:", err);
  alert("Error adding employee!");
}

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl mx-auto p-4 bg-white rounded-lg shadow"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-blue-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-blue-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-blue-500"
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-blue-500"
        />

        {/* ✅ Corrected the name attribute */}
        <input
          type="number"
          name="baseSalary"
          placeholder="Base Salary"
          value={formData.baseSalary}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-blue-500"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-blue-500"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => setShowWebcam(!showWebcam)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {showWebcam ? "Close Webcam" : "Open Webcam"}
      </button>

      {showWebcam && (
        <div className="my-4">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg border"
          />
          <button
            type="button"
            onClick={handleCapture}
            className="mt-2 bg-green-600 hover:bg-green-700"
          >
            Capture Image
          </button>
        </div>
      )}

      <button type="submit" className="register-button">
  Register Employee
</button>

<style>{`
  .register-button {
    width: 100%;
    background-color: #16a34a; /* dull green */
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 10px 0;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.2s ease;
  }

  .register-button:hover {
    background-color: #15803d; /* slightly darker on hover */
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
`}</style>

    </form>
  );
}
