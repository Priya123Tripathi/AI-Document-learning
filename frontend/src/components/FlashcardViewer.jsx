import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import API from "../api";

export default function FlashcardViewer() {
  const { setId } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSet = async () => {
      try {
        const res = await API.get(
          `/api/flashcards/set/${setId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = res.data;

        if (!data?.data) return;

        setCards(data.data.cards);
        setIndex(0);
        setFlip(false);

      } catch (err) {
        console.log(err);
      }
    };

    fetchSet();
  }, [setId, token]);

  const next = () => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
      setFlip(false);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setFlip(false);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        No flashcards found
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">

  
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64">
        <Navbar />

        <div className="p-4 md:p-6">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-black mb-4 md:mb-6 text-sm md:text-base"
          >
            ← Back to Sets
          </button>

          {/* Card */}
          <div className="flex justify-center items-center w-full">
            <div className="relative w-full max-w-[700px] h-[220px] md:h-[260px] perspective cursor-pointer">

              {/* Star */}
              <button
                onClick={(e) => e.stopPropagation()}
                className="absolute top-3 left-3 text-xl md:text-2xl text-yellow-400 z-50"
              >
                ★
              </button>

              {/* Flip */}
              <div
                onClick={() => setFlip(!flip)}
                className={`relative w-full h-full transition-transform duration-500 transform-3d ${
                  flip ? "rotate-y-180" : ""
                }`}
              >

                {/* Question */}
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center text-base md:text-xl border rounded-xl bg-white shadow-md px-4 md:px-10 text-center">
                  {cards[index]?.question}
                </div>

                {/* Answer */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center text-base md:text-xl border rounded-xl shadow-md px-4 md:px-10 text-center text-white bg-green-600">
                  {cards[index]?.answer}
                </div>

              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-6 mt-8 md:mt-10">

            <button
              onClick={prev}
              disabled={index === 0}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 w-full md:w-auto"
            >
              Previous
            </button>

            <span className="text-gray-600 font-medium text-sm md:text-base">
              {index + 1} / {cards.length}
            </span>

            <button
              onClick={next}
              disabled={index === cards.length - 1}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 w-full md:w-auto"
            >
              Next
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}