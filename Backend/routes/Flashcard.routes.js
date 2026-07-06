import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getAllFlashcardSets,
  getFlashcardSetById,
  getFlashcardsByDocument,
  deleteFlashcardSet,
} from "../controllers/flashcard.controller.js";

const router = express.Router();

router.get("/", verifyToken, getAllFlashcardSets);
router.get("/set/:setId", verifyToken, getFlashcardSetById);
router.get("/:documentId", verifyToken, getFlashcardsByDocument);
router.delete("/:setId", verifyToken, deleteFlashcardSet);

export default router;