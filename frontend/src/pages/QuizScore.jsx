import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import API from "../api";

export default function QuizScore() {
  const navigate = useNavigate();
  const { resultId } = useParams();
  const token = localStorage.getItem("token");

  const [result, setResult] = useState(null);

  useEffect(() => {
    API.get(`/api/quiz/result/${resultId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setResult(res.data))
      .catch(() => {});
  }, [resultId]);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  const quiz = result.quizId;
  const percentage = Math.round(
    (result.score / result.totalQuestions) * 100
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Navbar />

        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">

          {/* Score Card */}
          <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm text-center border">

            <h2 className="text-base md:text-xl font-semibold text-gray-500 mb-2">
              Your Score
            </h2>

            <div className="text-3xl md:text-5xl font-bold mb-2">
              {result.score}
              <span className="text-lg md:text-2xl text-gray-400">
                {" "} / {result.totalQuestions}
              </span>
            </div>

            <p className="text-sm md:text-lg text-gray-600 mb-4">
              {percentage}% Correct
            </p>

            {/* Progress */}
            <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${percentage}%`,
                  backgroundColor:
                    percentage >= 70
                      ? "#16a34a"
                      : percentage >= 40
                      ? "#f59e0b"
                      : "#dc2626",
                }}
              />
            </div>

            <p className="mt-3 text-xs md:text-sm text-gray-500">
              {percentage >= 70
                ? "Great job"
                : percentage >= 40
                ? "Good effort"
                : "Keep practicing"}
            </p>

          </div>

          {/* Questions */}
          {quiz.questions.map((q, index) => {
            const ans = result.answers[index];
            const userAnswer = ans.selected;
            const isCorrect = ans.isCorrect;

            return (
              <div
                key={index}
                className="bg-white p-4 md:p-6 rounded-xl shadow-sm border"
              >

                <h3 className="text-xs md:text-sm text-gray-400 mb-1">
                  Question {index + 1}
                </h3>

                <p className="mb-3 text-sm md:text-lg font-medium text-gray-800">
                  {q.question}
                </p>

                <div className="space-y-2 md:space-y-3">
                  {q.options.map((opt, i) => {
                    const isUser = userAnswer === opt;
                    const isRight = q.correctAnswer === opt;

                    let style =
                      "p-2 md:p-3 rounded-lg border flex justify-between items-center text-sm md:text-base";

                    if (isRight)
                      style += " bg-green-50 border-green-500";
                    else if (isUser && !isCorrect)
                      style += " bg-red-50 border-red-500";
                    else
                      style += " bg-gray-50";

                    return (
                      <div key={i} className={style}>
                        <span>{opt}</span>

                        <span className="text-xs md:text-sm">
                          {isRight && (
                            <span className="text-green-600 font-medium">
                              ✔
                            </span>
                          )}
                          {isUser && !isCorrect && (
                            <span className="text-red-600 font-medium">
                              ✖
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-xs md:text-sm text-blue-800">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Back */}
          <div className="text-center">
            <button
              onClick={() => navigate(-2)}
              className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Go Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}