import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiBookOpen,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome size={20} /> },
    { name: "Documents", path: "/documents", icon: <FiFileText size={20} /> },
    { name: "Flashcards", path: "/flashcards", icon: <FiBookOpen size={20} /> },
    { name: "Profile", path: "/profile", icon: <FiUser size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-500 p-2 rounded-xl shadow">
            <BsStars className="text-white text-lg" />
          </div>

          <h1 className="font-bold text-gray-800">
            AI Learning
          </h1>
        </div>

        <button onClick={() => setOpen(true)}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* Overlay */}

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white/95 backdrop-blur-md border-r border-slate-200 shadow-xl flex flex-col z-50 transition-transform duration-300
        ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header */}

        <div className="p-6 border-b border-slate-100">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="bg-gradient-to-r from-indigo-600 to-violet-500 p-3 rounded-2xl shadow-lg">

                <BsStars className="text-white text-xl" />

              </div>

              <div>

                <h2 className="font-bold text-gray-800 text-lg">
                  AI Learning
                </h2>

                <p className="text-xs text-gray-500">
                  Assistant
                </p>

              </div>

            </div>

            <button
              className="md:hidden"
              onClick={() => setOpen(false)}
            >
              <FiX size={22} />
            </button>

          </div>

        </div>

        {/* Menu */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 px-3">
            Main
          </p>

          <div className="space-y-2">

            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                >
                  {item.icon}

                  <span className="font-medium">
                    {item.name}
                  </span>
                </button>
              );
            })}

          </div>

          {/* Account */}

          <p className="text-xs uppercase tracking-widest text-gray-400 mt-10 mb-3 px-3">
            Account
          </p>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
          >
            <FiLogOut size={20} />

            <span className="font-medium">
              Logout
            </span>

          </button>

        </div>

        {/* Footer */}

        <div className="p-5 border-t border-slate-100">

          <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 p-4">

            <p className="font-semibold text-gray-800">
              AI Assistant
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Learn faster with AI-powered documents.
            </p>

          </div>

        </div>
      </aside>
    </>
  );
}