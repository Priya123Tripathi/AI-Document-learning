import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { handleAiAction } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/ai-action", verifyToken, handleAiAction);

export default router;