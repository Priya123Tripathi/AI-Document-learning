import path from "path";
import { fileURLToPath } from "url";
import { getPineconeIndex } from "./services/pineconeClient.js";
import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// to load env
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import documentRoutes from "./routes/document.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import helmet from "helmet";
import quizRoutes from "./routes/quiz.routes.js";
import flashcardRoutes from "./routes/Flashcard.routes.js";
import { generateEmbedding } from "./services/embeddingService.js";

const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    const corsOptions = {
      origin: [
        "https://ai-document-learning-aqxr.vercel.app",
        "https://ai-document-learning-wfz5.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
      ],
      credentials: true,
      maxAge: 86400,
    };

    app.use(cors(corsOptions));
    app.use(express.json({ limit: "10mb" }));

    app.use(
      helmet({
        crossOriginResourcePolicy: false, // allow static files to load
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "frame-ancestors": [
              "'self'",
              "http://localhost:5173",
              "https://ai-document-learning-wfz5.vercel.app",
              "https://ai-document-learning-aqxr.vercel.app", 
            ],
          },
        },
      })
    );

    // Serve static uploads
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // Rate limiter
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: {
        success: false,
        message: "Too many requests, please try again later.",
      },
    });

    app.use("/api/", limiter);
    app.use("/api/auth", authRoutes);
    app.use("/api/ai", aiRoutes);
    app.use("/api/quiz", quizRoutes);
    app.use("/api/documents", documentRoutes);
    app.use("/api/flashcards", flashcardRoutes);

    app.get("/", (req, res) => {
      res.status(200).json({ success: true, message: "🚀 API is running smoothly!" });
    });

    app.use((req, res, next) => {
      res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
      });
    });

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);

      try {
        const index = getPineconeIndex();
        const stats = await index.describeIndexStats();
        console.log("Pinecone connected! Stats:", stats);

        const testVector = await generateEmbedding("What is machine learning?");
        console.log("Embedding length:", testVector.length);
        console.log("Sample values:", testVector.slice(0, 5));
      } catch (err) {
        console.error("Pinecone connection failed:", err.message);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
