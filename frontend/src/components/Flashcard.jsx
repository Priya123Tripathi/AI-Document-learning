import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsCreditCard2Back } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { saveActivity } from "../utils/activity";
import { updateStats } from "../utils/stats";
import API from "./api";

export default function Flashcards({ documentId, token }) {
  const [cardSets, setCardSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const res = await fetch(
          `${API}/api/flashcards/${documentId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = await res.json();
        setCardSets(data?.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSets();
  }, [documentId, token]);

  const handleDelete = async (setId) => {
    if (!window.confirm("Delete this flashcard set?")) return;

    try {
      await fetch(`${API}/api/flashcards/${setId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      setCardSets(prev => prev.filter(set => set._id !== setId));
      updateStats("flashcard", "remove");
    } catch (err) {
      console.log(err);
    }
  };

  const generateFlashcards = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/ai/ai-action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId,
          type: "Flashcard"
        })
      });

      const data = await res.json();

      if (!data?.data) {
        alert("Flashcard is not generated");
        return;
      }

      setCardSets(prev => [...prev, data.data]);
      updateStats("flashcard", "add");
    } catch (e) {
      alert("AI error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">

      {/* EMPTY STATE */}
      {cardSets.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            No Flashcards Yet
          </h2>

          <button
            onClick={generateFlashcards}
            className="bg-green-600 text-white px-6 py-3 rounded-lg w-full md:w-auto transition-all duration-200"
          >
            {loading ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
      )}

      {/* LIST */}
      {cardSets.length > 0 && (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
            <h2 className="text-lg md:text-xl font-semibold">
              Your Flashcard Sets
            </h2>

            <button
              onClick={generateFlashcards}
              className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto transition-all duration-200"
            >
              Generate New Set
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

            {cardSets.map((set, index) => (
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

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(set._id);
                    }}
                    className="text-gray-400 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>

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

                {/* Hover text */}
                <div className="mt-3 text-sm text-green-600 font-medium md:opacity-0 md:group-hover:opacity-100 transition">
                  Open →
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}