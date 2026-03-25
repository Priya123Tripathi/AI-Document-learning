
import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Force dotenv to load the correct .env file BEFORE anything else
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


const startServer = async () => {
  try {
 
    await connectDB();

    const app = express();


    app.use(cors());
    app.use(express.json({ limit: "10mb" }));
    app.use(
  helmet({
    crossOriginResourcePolicy: false, // allow static files to load
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "frame-ancestors": ["'self'", "http://localhost:5173", "http://127.0.0.1:5173"], 
        //  allow your React dev server to embed iframes
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
     // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/ai", aiRoutes);
    app.use("/api/quiz", quizRoutes);
    app.use("/api/documents", documentRoutes);

    app.use("/api/flashcards", flashcardRoutes);

 

   


    // Health check
    app.get("/", (req, res) => {
      res.status(200).json({ success: true, message: "🚀 API is running smoothly!" });
    });

   app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.originalUrl}` 
  });
});

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
