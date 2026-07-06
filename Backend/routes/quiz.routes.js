import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  submitQuiz,
  getQuizResult,
  viewQuiz,
  generateQuiz,
  getQuizzesByDocument,
  getAllQuizzes,
  deleteQuiz,
} from "../controllers/quiz.controller.js";

const router = express.Router();

router.post("/submit/:quizId", verifyToken, submitQuiz);
router.get("/result/:resultId", verifyToken, getQuizResult);
router.get("/viewer/:quizId", verifyToken, viewQuiz);
router.post("/generate/:documentId", verifyToken, generateQuiz);
router.get("/document/:documentId", verifyToken, getQuizzesByDocument);
router.get("/", verifyToken, getAllQuizzes);
router.delete("/:id", verifyToken, deleteQuiz);

export default router;