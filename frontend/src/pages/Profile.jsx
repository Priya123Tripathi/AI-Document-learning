import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api";
export default function Profile() {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, [token]);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      const res = await API.put(
        `/api/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Navbar />

        <div className="p-4 md:p-6 max-w-2xl mx-auto">

          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            Profile Settings
          </h2>

          {/* User Info */}
          <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-4">
              User Information
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100 text-sm md:text-base"
              />

              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100 text-sm md:text-base"
              />
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white shadow-sm rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-4">
              Change Password
            </h3>

            <div className="space-y-3">
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 rounded text-sm md:text-base"
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 rounded text-sm md:text-base"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 rounded text-sm md:text-base"
              />

              <button
                onClick={handlePasswordSubmit}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                Change Password
              </button>

              {message && (
                <p className="text-sm text-green-600">
                  {message}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}