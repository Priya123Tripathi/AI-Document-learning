import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { MdOutlineQuiz } from "react-icons/md";
import { FiFileText, FiBookOpen } from "react-icons/fi";
import API from "../api";
import DashboardStatsCard from "../components/DashboardStatsCard";

export default function Dashboard() {
 

  const [stats, setStats] = useState({
    documents: 0,
    flashcards: 0,
    quizzes: 0
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivities = () => {
      const data =
        JSON.parse(localStorage.getItem("recentActivity")) || [];
      setActivities(data);
    };

    loadActivities();
    window.addEventListener("storage", loadActivities);

    return () => window.removeEventListener("storage", loadActivities);
  }, []);

const loadStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const [docsRes, flashRes, quizRes] = await Promise.all([
      API.get("/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      API.get("/api/flashcards", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      API.get("/api/quiz", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const documents = docsRes.data.documents.length;

    const flashcards = flashRes.data.data.length;

    const quizzes = quizRes.data.quizzes.length;

    setStats({
      documents,
      flashcards,
      quizzes,
    });
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  loadStats();
}, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
       <main className="flex-1 md:ml-72">

        <Navbar />

        <div className="p-4 md:p-6">

       {/* Heading */}
<div className="mb-6">
  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
    Dashboard
  </h2>

  <p className="text-gray-500 text-sm mt-1">
    Welcome to your AI Learning Assistant Dashboard
  </p>
</div>

{/* Stats */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-8">

  {/* Documents */}
  <DashboardStatsCard 
    title="Documents"
    value={stats.documents}
    icon={<FiFileText/>}
    color="bg-blue-100 text-blue-600"
  />

  {/* Flashcards */}
  <DashboardStatsCard
    title="Flashcards"
    value={stats.flashcards}
    icon={<FiBookOpen />}
    color="bg-purple-100 text-purple-600"
  />

  {/* Quizzes */}
  <DashboardStatsCard
    title="Quizzes"
    value={stats.quizzes}
    icon={<MdOutlineQuiz />}
    color="bg-orange-100 text-orange-600"
  />

</div>

{/* Activity */}
<div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">

  <h3 className="text-base font-semibold mb-4 text-gray-800">
    Recent Activity
  </h3>

  <ul className="divide-y divide-gray-100">

    {activities.length === 0 && (
      <li className="py-4 text-gray-500 text-sm">
        No recent activity
      </li>
    )}

    {activities.map((item) => (
      <li
        key={item.id}
        className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1"
      >
        <span className="text-sm text-gray-700">
          {item.message}
        </span>

        <span className="text-xs text-gray-400">
          {item.time}
        </span>
      </li>
    ))}

  </ul>

</div>

        </div>
      </main>
    </div>
  );
}