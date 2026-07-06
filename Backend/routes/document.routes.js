import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
} from "../controllers/document.controller.js";

const router = express.Router();

// uploads directory 
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post("/upload", verifyToken, upload.single("file"), uploadDocument);
router.get("/", verifyToken, getAllDocuments);
router.get("/:id", verifyToken, getDocumentById);
router.delete("/:id", verifyToken, deleteDocument);

export default router;