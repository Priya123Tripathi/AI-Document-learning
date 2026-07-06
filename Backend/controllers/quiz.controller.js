import axios from "axios";
import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";

// Submit quiz answers
export const submitQuiz = async (req, res) => {
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
};

// Get quiz result
export const getQuizResult = async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.resultId).populate("quizId");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View a quiz (for attempting)
export const viewQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate a new quiz using Gemini
export const generateQuiz = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

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

    const resp = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const rawText = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({ message: "No response from AI" });
    }

    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (err) {
      console.error("Parse Error:", cleaned);
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({ message: "Invalid quiz format" });
    }

    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || !q.correctAnswer) {
        return res.status(500).json({ message: "Malformed quiz structure" });
      }
    }

    const newQuiz = new Quiz({
      documentId,
      questions,
      totalQuestions: questions.length,
    });

    await newQuiz.save();

    res.status(201).json(newQuiz);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};

// Get all quizzes for a specific document
export const getQuizzesByDocument = async (req, res) => {
  try {
    console.log("Params:", req.params);
    console.log("User:", req.user);

    const { documentId } = req.params;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    console.log("Document:", document);

    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const quizzes = await Quiz.find({ documentId }).sort({ createdAt: -1 });
    res.json(quizzes);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all quizzes for the logged-in user (across all documents)
export const getAllQuizzes = async (req, res) => {
  try {
    const documents = await Document.find({
      uploadedBy: req.user.id,
    }).select("_id");

    const documentIds = documents.map((doc) => doc._id);

    const quizzes = await Quiz.find({
      documentId: { $in: documentIds },
    });

    res.json({
      success: true,
      quizzes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
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
};