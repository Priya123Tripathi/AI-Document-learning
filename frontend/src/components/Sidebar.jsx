import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiBookOpen,
  FiUser,
  FiLogOut,
  FiMenu
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-30">
        <h1 className="text-sm font-semibold flex items-center gap-2">
          <BsStars className="text-green-600" />
          AI Assistant
        </h1>

        <button onClick={() => setOpen(true)}>
          <FiMenu size={20} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-green-600 p-2 rounded">
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
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-left rounded-md transition
                      ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700 font-semibold"
                          : "text-gray-700 hover:bg-emerald-50"
                      }`}
                  >
                    {item.icon}
                    {item.name}
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
            className="flex items-center gap-3 text-gray-700 hover:text-red-600"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>

      </aside>
    </>
  );
}