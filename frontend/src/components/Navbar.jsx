import { FiBell, FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "./api";


export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${API}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user || res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">


      {/* Right */}
      <div className="flex items-center gap-3 md:gap-6 ml-auto">

        {/* Profile */}
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 md:gap-3 cursor-pointer"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User"
            )}&background=6366f1&color=fff`}
            alt="User avatar"
            className="h-8 w-8 md:h-9 md:w-9 rounded-full border"
          />

          {/* Hide details on small screens */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-800">
              {user?.name || ""}
            </span>
            <span className="text-xs text-gray-500">
              {user?.email || ""}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}