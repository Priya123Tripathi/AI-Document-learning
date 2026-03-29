import { useState } from "react";

import { saveActivity } from "../utils/activity";
import { BsStars } from "react-icons/bs";
import API from "../api";

export default function AiAction({ documentId, token }) {
  const [concept, setConcept] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTitle, setModalTitle] = useState("");


  const handleSummarize = async () => {
    saveActivity("Summary", "Generated a summary");
    try {
      setLoading(true);

      const res = await API.post(
        `/api/ai/ai-action`,
        { documentId, type: "summary" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSummary(res.data.answer);
      setModalTitle("Document Summary");
      setModalText(res.data.answer);
      setShowModal(true);
    } catch (err) {
      console.error("Summary error:", err);
    }
    setLoading(false);
  };

  const handleExplain = async () => {
    saveActivity("Explain", "Asked about a doubt");
    try {
      setLoading(true);

      const res = await API.post(
        `/api/ai/ai-action`,
        {
          documentId,
          type: "explain",
          concept,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setExplanation(res.data.answer);
      setModalTitle(`Explanation of "${concept}"`);
      setModalText(res.data.answer);
      setShowModal(true);
    } catch (err) {
      console.error("Explain error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 h-auto md:h-[80vh] overflow-y-auto">

      {/* Heading */}
      <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
        <span className="bg-green-600 p-2 rounded flex items-center justify-center">
          <BsStars className="text-white text-lg" />
        </span>
        AI Actions
      </h2>

      {/* Summary Section */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-2">Generate Summary</h3>

        <button
          onClick={handleSummarize}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full md:w-auto transition-all duration-200"
        >
          Summarize
        </button>

        {loading && (
          <p className="mt-2 text-gray-500 text-sm">
            Generating summary...
          </p>
        )}
      </div>

      {/* Explain Section */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Explain a Concept</h3>

        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Enter concept"
            className="border p-2 flex-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={handleExplain}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full md:w-auto transition-all duration-200"
          >
            Explain
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">

          <div className="bg-white w-full max-w-lg max-h-[80vh] rounded-xl shadow-xl flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-center border-b px-4 md:px-5 py-3">
              <h2 className="text-base md:text-lg font-semibold">
                {modalTitle}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black text-lg"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 md:p-5 overflow-y-auto text-gray-700 whitespace-pre-wrap text-sm md:text-base">
              {modalText}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}