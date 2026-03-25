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
      .then((res) => setQuiz(res.data));
}, [id, token]);


const handleSubmit = async () => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/quiz/submit/${id}`,
      { selectedAnswers: selected },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const resultId = res.data._id;

    saveActivity("Quiz", "Solved a Quiz");

    navigate(`/quizScore/${resultId}`);

  } catch (err) {
    console.error(err);
  }
};
 
if (!quiz || !quiz.questions || quiz.questions.length === 0) {
  return <p>Loading...</p>;
}


  const question = quiz.questions[current];
  return (
        <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
    <div className="p-6">
      <h2>
        Question {current + 1} of {quiz.totalQuestions}
      </h2>

      <h3 className="mt-4 font-semibold">{question.question}</h3>

      <div className="mt-4 space-y-2">
        {question.options.map((opt, i) => (
          <label key={i} className="block border p-2 rounded">
            <input
              type="radio" //for making options we use radio type
              name={`question-${current}`}
              value={opt}
              onChange={() =>
                setSelected({ ...selected, [current]: opt })
              }
              checked={selected[current] === opt}
            />
            {opt}
          </label>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        {current > 0 && (
          <button  onClick={() => setCurrent(current - 1)} className="px-4 py-2 bg-green-600 text-white rounded-md">Prev</button>
        )}
        {current < quiz.questions.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}className="px-4 py-2 bg-green-600 text-white rounded-md">Next</button>
        ) : (
          <button onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-md" >Submit</button>
        )}
      </div>

      </div>
       </div>
    </div>
  );
}