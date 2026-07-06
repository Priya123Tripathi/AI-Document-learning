import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { saveActivity } from "../utils/activity";

import { FiTrash2 } from "react-icons/fi";
import { MdOutlineQuiz } from "react-icons/md";
import API from "../api";

export default function Quiz({ documentId, token, doc }) {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuiz = async () => {
    try {
      const { data } = await API.get(
        `/api/quiz/document/${documentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuizzes(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (documentId && token) fetchQuiz();
  }, [documentId, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;

    try {
      await API.delete(
        `/api/quiz/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchQuiz();
     
      saveActivity("Quiz", "Deleted a Quiz");
    } catch (err) {
      console.log(err);
    }
  };

  const generateQuiz = async () => {
    try {
      setLoading(true);

      const res = await API.post(
        `/api/quiz/generate/${documentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        await fetchQuiz();
      
        saveActivity("Quiz", "Created a new Quiz");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">

        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Quizzes
        </h2>

        <button
          onClick={generateQuiz}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow w-full md:w-auto transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "+ Generate Quiz"}
        </button>

      </div>

      {/* Empty */}
      {quizzes.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No quizzes available
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

        {quizzes.map((quiz, index) => (
          <div
            key={quiz._id}
            className="group bg-white border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md hover:border-violet-400 transition-all flex flex-col justify-between"
          >

            {/* Top */}
            <div className="flex justify-between items-start">

              <div className="flex items-center gap-3">

                <div className="bg-violet-100 text-violet-600 w-9 h-9 rounded-md flex items-center justify-center">
                  <MdOutlineQuiz size={16} />
                </div>

                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-800">
                    Quiz {index + 1}
                  </h3>

                  <p className="text-xs text-gray-400">
                    {doc?.createdAt
                      ? new Date(doc.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>

              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(quiz._id)}
                className="text-gray-400 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition"
              >
                <FiTrash2 size={16} />
              </button>

            </div>

            {/* Info */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {quiz?.questions?.length || 0} Questions
              </span>

              <span className="text-xs bg-violet-50 text-violet-600 px-2 py-1 rounded">
                Quiz
              </span>
            </div>

            {/* Action */}
            <button
              onClick={() => navigate(`/quizViewer/${quiz._id}`)}
              className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700 transition"
            >
              Solve Quiz →
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}