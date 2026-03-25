import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiBookOpen,
  FiUser,
  FiLogOut
} from "react-icons/fi";

import { BsStars } from "react-icons/bs";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome size={18} /> },
    { name: "Documents", path: "/documents", icon: <FiFileText size={18} /> },
    { name: "Flashcards", path: "/flashcards", icon: <FiBookOpen size={18} /> },
    { name: "Profile", path: "/profile", icon: <FiUser size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
      {/* Header */}
<div className="p-6 border-b border-gray-100">
  <h1 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
    <span className="bg-green-600 p-2 rounded flex items-center justify-center">
      <BsStars className="text-white text-lg" />
    </span>
    AI Learning Assistant
  </h1>
</div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto mt-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-left rounded-md transition-all duration-200
                    ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700 font-semibold"
                        : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-all"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
