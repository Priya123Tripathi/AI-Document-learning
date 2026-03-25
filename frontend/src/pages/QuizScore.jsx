import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";


export default function QuizScore() {
   const navigate = useNavigate();
   
  const { resultId } = useParams();
  const token = localStorage.getItem("token");

  const [result, setResult] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/quiz/result/${resultId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setResult(res.data))
      .catch((err) => console.error(err));
  }, [resultId]);

  if (!result) return <p>Loading...</p>;

  const quiz = result.quizId;



  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

       <div className="p-8 max-w-5xl mx-auto space-y-6">
       
       <div className="bg-white p-8 rounded-2xl shadow-lg text-center mb-6 border">
  <h2 className="text-xl font-semibold text-gray-500 mb-2">
    Your Score
  </h2>

  {/* Big Score */}
  <div className="text-5xl font-extrabold mb-2">
    {result.score}
    <span className="text-2xl text-gray-400">
      {" "} / {result.totalQuestions}
    </span>
  </div>

  {/* Percentage */}
  <p className="text-lg font-medium text-gray-600 mb-4">
    {Math.round((result.score / result.totalQuestions) * 100)}% Correct
  </p>

  {/* Progress Bar */}
  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
    <div
      className="h-3 rounded-full transition-all duration-500"
      style={{
        width: `${(result.score / result.totalQuestions) * 100}%`,
        backgroundColor:
          (result.score / result.totalQuestions) * 100 >= 70
            ? "#16a34a"
            : (result.score / result.totalQuestions) * 100 >= 40
            ? "#f59e0b"
            : "#dc2626",
      }}
    ></div>
  </div>

  {/* Feedback Text */}
  <p className="mt-4 text-sm text-gray-500">
    {(result.score / result.totalQuestions) * 100 >= 70
      ? "Great job! "
      : (result.score / result.totalQuestions) * 100 >= 40
      ? "Good effort, keep improving "
      : "Keep practicing, you’ll get better "}
  </p>
</div>

          {/* Questions */}


{quiz.questions.map((q, index) => {
  const ans = result.answers[index];
  const userAnswer = ans.selected;
  const isCorrect = ans.isCorrect;
 
  return(
       <div
  key={index}
  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border"
>
  <h3 className="text-sm text-gray-400 mb-1">
    Question {index + 1}
  </h3>

  <p className="mb-4 text-lg font-medium text-gray-800">
    {q.question}
  </p>

  <div className="space-y-3">
    {q.options.map((opt, i) => {
      const isUser = userAnswer === opt;
      const isRight = q.correctAnswer === opt;

      let style =
        "p-3 rounded-lg border flex justify-between items-center transition-all";

      if (isRight)
        style += " bg-green-50 border-green-500";
      else if (isUser && !isCorrect)
        style += " bg-red-50 border-red-500";
      else
        style += " bg-gray-50";

      return (
        <div key={i} className={style}>
          <span>{opt}</span>

          <span className="text-sm">
            {isRight && (
              <span className="text-green-600 font-medium">
                ✔ Correct
              </span>
            )}

            {isUser && !isCorrect && (
              <span className="text-red-600 font-medium">
                ✖ Your Answer
              </span>
            )}
          </span>
        </div>
      );
    })}
  </div>

  {/* Explanation */}
  {q.explanation && (
    <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
      <p className="text-sm text-blue-800">
        <strong>Explanation:</strong> {q.explanation}
      </p>
    </div>
  )}
</div>
  );
})}

          <div className="text-center mt-6">
            <button
              onClick={() => navigate(-2)}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}