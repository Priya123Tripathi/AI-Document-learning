import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveActivity } from "../utils/activity";
import { updateStats } from "../utils/stats";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineQuiz } from "react-icons/md";

export default function Quiz({ documentId, token, doc }) {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch quizzes
  const fetchQuiz = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/quiz/document/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuizzes(data);
    } catch (err) {
      console.log("Fetch Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (documentId && token) {
      fetchQuiz();
    }
  }, [documentId, token]);

  // delete quiz
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    console.log("Deleting:", id);
    try {
      await axios.delete(
        `http://localhost:8000/api/quiz/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchQuiz();
      updateStats("quiz", "remove");
      saveActivity("Quiz", "Deleted a Quiz");
    } catch (err) {
      console.log("Delete Error:", err.response?.data || err.message);
    }
  };

  // generate quiz
  const generateQuiz = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:8000/api/quiz/generate/${documentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        await fetchQuiz();
        updateStats("quiz", "add");
        saveActivity("Quiz", "Created a new Quiz");
      }
    } catch (err) {
      console.log("Generate Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* generate button */}
      <div className="flex justify-end">
        <button
          onClick={generateQuiz}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          {loading ? "Generating..." : "+ Generate Quiz"}
        </button>
      </div>

      {/* empty state */}
      {quizzes.length === 0 && (
        <p className="text-gray-500">No quizzes yet.</p>
      )}

      {/* quiz cards */}
     
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {quizzes.map((quiz, index) => (

    <div
      key={quiz._id}
      className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-green-400 transition-all flex flex-col justify-between"
    >

      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div className="flex items-center gap-3">

          {/* ICON */}
          <div className="bg-green-100 text-green-600 w-9 h-9 rounded-md flex items-center justify-center">
            <MdOutlineQuiz size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Quiz {index + 1}
            </h3>

            <p className="text-xs text-gray-400 mt-[2px]">
              {doc?.createdAt
                ? new Date(doc.createdAt).toLocaleDateString()
                : ""}
            </p>
          </div>

        </div>

        {/* DELETE */}
        <button
          onClick={() => handleDelete(quiz._id)}
          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
        >
          <FiTrash2 size={16} />
        </button>

      </div>

      {/* INFO */}
      <div className="mt-5 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {quiz?.questions?.length || 0} Questions
        </span>

        <span className="text-xs bg-green-50 text-green-600 px-2 py-[2px] rounded">
          Quiz
        </span>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => navigate(`/quizViewer/${quiz._id}`)}
        className="mt-5 text-sm font-medium text-green-600 hover:text-green-700 transition"
      >
        Solve Quiz →
      </button>

    </div>
  ))}
</div>
    </div>
  );
}