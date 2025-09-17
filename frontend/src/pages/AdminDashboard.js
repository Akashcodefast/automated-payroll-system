import React from "react";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import EmployeeTable from "../components/Dashboard/EmployeeTable";
import SalarySummary from "../components/Dashboard/SalarySummary";
import PredictForm from "../components/Salary/PredictForm";
import Register from "./Register";

export default function AdminDashboard() {
  const role = localStorage.getItem("role") || "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <div className="flex-1 p-8 space-y-8">
          
          {/* Add Employee Section */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h1 className="text-2xl font-bold text-blue-700 mb-4">➕ Add Employee</h1>
            <Register />
          </div>

          {/* Employees Table */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">👥 Employees</h2>
            {/* EmployeeTable now handles its own fetching */}
            <EmployeeTable />
          </div>

          {/* Monthly Salary Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Monthly Salary Summary</h3>
            <SalarySummary rows={[]} /> {/* Keep empty for now or implement separately */}
          </div>

          {/* Predict Salary */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Predict Salary (Single Employee)</h3>
            <PredictForm />
          </div>
        </div>
      </div>
    </div>
  );
}
