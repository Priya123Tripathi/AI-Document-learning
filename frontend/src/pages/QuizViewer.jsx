import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { saveActivity } from "../utils/activity";

export default function QuizViewer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/quiz/viewer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setQuiz(res.data))
      .catch(() => {});
  }, [id, token]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/quiz/submit/${id}`,
        { selectedAnswers: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      saveActivity("Quiz", "Solved a Quiz");
      navigate(`/quizScore/${res.data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!quiz || !quiz.questions?.length) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  const question = quiz.questions[current];

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Navbar />

        <div className="p-4 md:p-6 max-w-3xl mx-auto">

          {/* Progress */}
          <h2 className="text-sm md:text-base text-gray-500 mb-2">
            Question {current + 1} of {quiz.totalQuestions}
          </h2>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">

            <h3 className="text-base md:text-lg font-semibold mb-4">
              {question.question}
            </h3>

            {/* Options */}
            <div className="space-y-2 md:space-y-3">
              {question.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition
                    ${
                      selected[current] === opt
                        ? "border-green-500 bg-green-50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${current}`}
                    value={opt}
                    checked={selected[current] === opt}
                    onChange={() =>
                      setSelected({ ...selected, [current]: opt })
                    }
                  />
                  <span className="text-sm md:text-base">{opt}</span>
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col md:flex-row gap-3 justify-between">

              {current > 0 && (
                <button
                  onClick={() => setCurrent(current - 1)}
                  className="w-full md:w-auto px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Previous
                </button>
              )}

              {current < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrent(current + 1)}
                  className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Submit
                </button>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}