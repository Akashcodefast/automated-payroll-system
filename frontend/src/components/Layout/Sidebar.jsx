// src/components/Layout/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar({ role }) {
  const items =
    role === "admin"
      ? [
          { label: "Dashboard", to: "/admin" },
          { label: "Reports", to: "/reports" },
        ]
      : [{ label: "My Attendance", to: "/employee" }];

  return (
    <>
      <aside className="h-screen w-56 bg-gray-50 border-r border-gray-200 px-4 py-6 fixed top-0 left-0 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">
          {role === "admin" ? "Admin Panel" : "Employee Panel"}
        </h2>

        <nav className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="sidebar-button"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <style>{`
        .sidebar-button {
          display: block;
          text-decoration: none;
          color: #ffffff;              /* Text color */
          background-color: #6b7280;   /* Dull/muted background color */
          border-radius: 5px;
          padding: 0.5rem 0.75rem;
          width: 100px;
          margin-bottom: 12px;         /* Increased space between buttons */
          transition: background-color 0.2s ease;
        }

        .sidebar-button:hover {
          background-color: #4b5563;   /* Slightly darker on hover */
        }
      `}</style>
    </>
  );
}
