import React, { useEffect, useState } from "react";
import { getEmployees } from "../../services/employeeService";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEmployees();
        setEmployees(res.data?.data || []);
      } catch (e) {
        console.error("Error fetching employees:", e);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 text-center py-6 text-lg">
        Loading employees...
      </p>
    );
  if (!employees.length)
    return (
      <p className="text-gray-500 text-center py-6 text-lg">
        No employees found.
      </p>
    );

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          👥 Employees ({employees.length})
        </h2>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Salary
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {employees.map((e, idx) => (
            <tr
              key={e._id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                {idx + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                {e.name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    e.role === "admin"
                      ? "bg-red-100 text-red-800"
                      : e.role === "hr"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {e.role || "N/A"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {e.department || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">
                ${e.baseSalary ?? "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
