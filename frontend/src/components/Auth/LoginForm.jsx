// src/components/Auth/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await login(form);
      const { token, user } = res;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      nav(user.role === "admin" ? "/admin" : "/employee", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 lg:px-8">
      <header className="pt-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm">
          Automated Payroll System
        </h1>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-blue-200">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-700 mb-8">
            Employee Login 👋
          </h2>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {err && <p className="text-red-500 text-center">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Automated Payroll System. All rights reserved.
      </footer>
    </div>
  );
}
