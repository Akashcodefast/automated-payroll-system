import React, { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminRegister from "./AdminRegister";
import EmployeeLogin from "./EmployeeLogin";
import EmployeeRegister from "./EmployeeRegister";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("employeeLogin");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Payroll System</h1>

      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab("employeeLogin")}
          className={`px-4 py-2 rounded ${
            activeTab === "employeeLogin" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Employee Login
        </button>
        {/* <button
          onClick={() => setActiveTab("employeeRegister")}
          className={`px-4 py-2 rounded ${
            activeTab === "employeeRegister" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Employee Register
        </button> */}
        <button
          onClick={() => setActiveTab("adminLogin")}
          className={`px-4 py-2 rounded ${
            activeTab === "adminLogin" ? "bg-green-600 text-white" : "bg-gray-300"
          }`}
        >
          Admin Login
        </button>
        {/* <button
          onClick={() => setActiveTab("adminRegister")}
          className={`px-4 py-2 rounded ${
            activeTab === "adminRegister" ? "bg-green-600 text-white" : "bg-gray-300"
          }`}
        >
          Admin Register
        </button> */}
      </div>

      {/* Active Tab Component */}
      <div className="w-full max-w-md">
        {activeTab === "employeeLogin" && <EmployeeLogin />}
        {activeTab === "employeeRegister" && <EmployeeRegister />}
        {activeTab === "adminLogin" && <AdminLogin />}
        {activeTab === "adminRegister" && <AdminRegister />}
      </div>
    </div>
  );
}
