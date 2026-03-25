import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Profile() {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  // Fetch user data
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
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
      const res = await axios.put(
        "http://localhost:8000/api/auth/change-password",
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

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (

        <div className="flex bg-gray-50 min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Navbar />
    
            <div className="p-8">
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">

      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

      {/* ================= USER INFO ================= */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">User Information</h3>

        <div className="space-y-4">
          <input
            type="text"
            value={user.name}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />

          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>
      </div>

      {/*  CHANGE PASSWORD  */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

        <div className="space-y-4">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded"
          />

          <button
            onClick={handlePasswordSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Change Password
          </button>

          {message && (
            <p className="text-sm text-green-600">{message}</p>
          )}
        </div>
      </div>

    </div>
     </div>
      </div>
       </div>
  );
}