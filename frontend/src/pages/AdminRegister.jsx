import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting admin data:", formData); // Debug
    try {
      await axios.post("http://localhost:8080/api/admin/register", formData, {
        headers: { "Content-Type": "application/json" },
      });
      navigate("/auth"); // back to auth page
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg w-full"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
        Register
      </button>
    </form>
  );
}
