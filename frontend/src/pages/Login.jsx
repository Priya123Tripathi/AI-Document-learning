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
    e.preventDefault();//page reload stop 
    setLoading(true);
    
    try {
    await loginUser(form);
    
      navigate("/dashboard"); // next page
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <div className="bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl w-full max-w-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email address"
           value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            autoComplete="current-password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-white/90 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-200 font-semibold underline hover:text-white transition">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
