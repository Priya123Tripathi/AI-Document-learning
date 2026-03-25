import { FiBell, FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });

  // Load user info from localStorage when Navbar mounts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      


      {/* Right Section */}
      <div className="flex items-center gap-6 ml-auto">
 
        {/* Profile Section */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img onClick={()=>navigate("/profile")}
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name || "User"
            )}&background=6366f1&color=fff`}
            alt="User avatar"
            className="h-9 w-9 rounded-full border border-gray-300"
          />
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-800">
              {user.name || "Loading..."}
            </span>
            <span className="text-xs text-gray-500">
              {user.email || "example@email.com"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
