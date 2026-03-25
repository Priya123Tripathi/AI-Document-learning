import express from "express";
import Document from "../models/Document.js";
import  Quiz from "../models/Quiz.js"
import { verifyToken } from "../middleware/auth.middleware.js";
import axios from "axios";
import QuizResult from "../models/QuizResult.js";

const router = express.Router();

//submit quiz
router.post("/submit/:quizId", verifyToken, async (req, res) => {
  try {
    const { selectedAnswers } = req.body;

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;

    const answers = quiz.questions.map((q, index) => {
      const selected = selectedAnswers[index];
      const isCorrect = selected === q.correctAnswer;

      if (isCorrect) score++;

      return {
        questionIndex: index,
        selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const result = await QuizResult.create({
      userId: req.user.id,
      quizId: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
      answers,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get result
router.get("/result/:resultId", verifyToken, async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.resultId)
      .populate("quizId");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//viewing quizzes
router.get("/viewer/:quizId", verifyToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//generating quizzes
router.post("/generate/:documentId", verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;

    // 1 Find document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
 //ownership check
if (document.uploadedBy.toString() !== req.user.id){
  return res.status(403).json({ message: "Unauthorized access" });
}


    // 3 Gemini API setup
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
  return res.status(500).json({ message: "Gemini API key missing" });
}
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

   const prompt = `
Generate 5 multiple choice questions from the document below.

Each question MUST include:
- question
- 4 options
- correctAnswer
- explanation (why the answer is correct)

Return ONLY valid JSON in this format:

[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correctAnswer": "",
    "explanation": ""
  }
]

DOCUMENT:
${document.textContent.slice(0, 15000)}
`;

    // 4- Call Gemini
    const resp = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const rawText = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({ message: "No response from AI" });
    }

    // 5- Clean + Parse
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (err) {
      console.error("Parse Error:", cleaned);
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    // 6- Save quiz
    const newQuiz = new Quiz({
      documentId,
      questions,
      totalQuestions: questions.length,
    
    });

    if (!Array.isArray(questions) || questions.length === 0) {
  return res.status(500).json({ message: "Invalid quiz format" });
}

for (const q of questions) {
  if (!q.question || !Array.isArray(q.options) || !q.correctAnswer) {
    return res.status(500).json({ message: "Malformed quiz structure" });
  }
}

    await newQuiz.save();

    res.status(201).json(newQuiz);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Quiz generation failed" });
  }
});

//getting all the quizzes
router.get("/document/:documentId", verifyToken, async (req, res) => {
try{
 
      console.log("Params:", req.params);
    console.log("User:", req.user);

  const {documentId}=req.params;

  const document = await Document.findById(documentId);

if (!document) {
  return res.status(404).json({ message: "Document not found" });
}
console.log("Document:", document);

if (document.uploadedBy.toString() !== req.user.id){
  return res.status(403).json({ message: "Unauthorized access" });
}

const quizzes = await Quiz.find({ documentId }).sort({ createdAt: -1 });
res.json(quizzes);
  
}catch(err){
    res.status(500).json({msg : err.message});
}

})
// DELETE quiz
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    console.log("DELETE HIT:", req.params.id);
    const { id } = req.params;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await Quiz.findByIdAndDelete(id);

    res.status(200).json({ message: "Quiz deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;