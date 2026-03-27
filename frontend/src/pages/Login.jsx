import { useState } from "react";
import { loginUser } from "../services/authApi";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser(form);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500">

      <div className="w-full max-w-md">

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/40">

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Welcome Back
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Sign in to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder=" "
                value={form.email}
                onChange={handleChange}
                required
                className="peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                name="password"
                type="password"
                placeholder=" "
                value={form.password}
                onChange={handleChange}
                required
                className="peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600">
                Password
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition shadow-md hover:shadow-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-green-600 font-medium hover:underline"
            >
              Signup
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;