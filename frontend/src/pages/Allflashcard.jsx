import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { BsCreditCard2Back } from "react-icons/bs";
import Navbar from "../components/Navbar";

export default function Allflashcard() {
  const [sets, setSets] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/flashcards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setSets(data.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAll();
  }, [token]);

  return (
    <div className="flex bg-gray-50 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 md:ml-64">
        <Navbar />

        <div className="p-4 md:p-6">

          {/* Heading */}
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            All Flashcards
          </h2>

          {/* Empty */}
          {sets.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No flashcard sets available
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

            {sets.map((set, index) => (
              <div
                key={set._id}
                onClick={() =>
                  navigate(`/flashcards/view/${set.documentId}/${set._id}`)
                }
                className="relative group bg-white border rounded-xl p-4 md:p-5 cursor-pointer hover:shadow-lg transition-all duration-200 md:hover:-translate-y-1 flex flex-col justify-between"
              >

                {/* Top */}
                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 text-green-600 w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center">
                      <BsCreditCard2Back size={16} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                        Set {index + 1}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Flashcards
                      </p>
                    </div>
                  </div>

                </div>

                {/* Info */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {set.cards.length} cards
                  </span>

                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500">
                    Study Set
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-3 text-sm text-green-600 font-medium md:opacity-0 md:group-hover:opacity-100 transition">
                  Open →
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}