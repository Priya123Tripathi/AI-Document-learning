import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { MdOutlineQuiz } from "react-icons/md";
import {

  FiFileText,
  FiBookOpen,

} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
const  navigate=useNavigate();
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

      console.log("Loaded Activities:", data);

      setActivities(data);

    };

    loadActivities();

    window.addEventListener("storage", loadActivities);

  }, []);
useEffect(() => {

  const loadStats = () => {
    const saved = JSON.parse(localStorage.getItem("stats"));
    if (saved) {
      setStats(saved);
    }
  };

  loadStats();

  window.addEventListener("storage", loadStats);

  return () => window.removeEventListener("storage", loadStats);

}, []);


  return (

    <div className="flex min-h-screen bg-gray-50 text-gray-900">

      <Sidebar />

      <main className="flex-1 p-8 ml-64 bg-gray-50 min-h-screen">

        <Navbar />

        <h2 className="text-3xl font-semibold mb-4">
          Dashboard
        </h2>

        <p className="text-gray-600 mb-8">
          Welcome to your AI Learning Assistant Dashboard!
        </p>


        {/* Stats Section */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">

  {/* Documents */}
  <div onClick={()=>{navigate("/documents")}} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition">
    <div className="flex items-center gap-3">
      
      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
        <FiFileText size={18} />
      </div>

      <span className="text-sm font-medium text-gray-600">
        Documents
      </span>
    </div>

    <h3 className="text-3xl font-bold text-blue-600 mt-4">
      {stats.documents}
    </h3>
  </div>


  {/* Flashcards  */}
  <div onClick={()=>{navigate("/flashcards")}} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition">
    <div className="flex items-center gap-3">
      
      <div className="bg-pink-100 text-pink-600 p-2 rounded-lg">
        <FiBookOpen size={18} />
      </div>

      <span className="text-sm font-medium text-gray-600">
        Flashcards
      </span>
    </div>

    <h3 className="text-3xl font-bold text-pink-600 mt-4">
      {stats.flashcards}
    </h3>
  </div>


   {/* Quizes */}
  <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition">
    <div className="flex items-center gap-3">
      
      <div className="bg-green-100 text-green-600 p-2 rounded-lg">
        <MdOutlineQuiz size={18} />
      </div>

      <span className="text-sm font-medium text-gray-600">
        Quizzes
      </span>
    </div>

    <h3 className="text-3xl font-bold text-green-600 mt-4">
      {stats.quizzes}
    </h3>
  </div>

</div>

        {/* Recent Activity */}

        <div className="bg-white shadow-md rounded-lg p-6">

          <h3 className="text-lg font-semibold mb-4">
            Recent Activity
          </h3>

          <ul className="divide-y divide-gray-100">

            {activities.length === 0 && (
              <li className="py-3 text-gray-500">
                No recent activity
              </li>
            )}

            {activities.map((item) => (
              <li
                key={item.id}
                className="py-3 flex justify-between"
              >
                <span>{item.message}</span>
                <span className="text-sm text-gray-400">
                  {item.time}
                </span>
              </li>
            ))}

          </ul>

        </div>

      </main>

    </div>

  );
}