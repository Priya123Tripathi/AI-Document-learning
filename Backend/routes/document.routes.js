import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Tesseract from "tesseract.js";
import { fromPath } from "pdf2pic";
import DocumentModule from "../models/Document.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { execSync } from "child_process"; // OCR enhancement ke liye


import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

//  unwrap default export
const Document = DocumentModule.default || DocumentModule;

const router = express.Router();

// __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



//  Ensure uploads directory exists
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

async function extractText(filePath) {
  try {
    console.log(" Checking file existence at:", filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at path: " + filePath);
    }

    // Try pdf-parse (Digital Text)
    const dataBuffer = fs.readFileSync(filePath);
    const result = await pdfParse(dataBuffer);

    if (result && result.text && result.text.trim().length > 50) {
      console.log(" Digital text found via pdf-parse");
      return { text: result.text.trim(), method: "pdf-parse" };
    }

    //  OCR Mode (Scanned PDF)
    console.log(" Scanned PDF detected. Starting OCR...");
    
    const options = {
      density: 300,
      saveFilename: `ocr_${Date.now()}`,
      savePath: uploadDir, 
      format: "png",
      width: 1600,
      height: 2000
    };

    const convert = fromPath(filePath, options);
    const storeAsImage = await convert(1); 

    // Fallback path logic in case storeAsImage.path is undefined
    const actualImagePath = storeAsImage.path || path.join(uploadDir, `${options.saveFilename}.1.png`);
    
    console.log("OCR Image Path:", actualImagePath);

    if (!fs.existsSync(actualImagePath)) {
      throw new Error("Image conversion failed - file not found.");
    }

    // Tesseract Recognize
    const { data: { text } } = await Tesseract.recognize(actualImagePath, 'eng+hin');
    
    // Clean up temporary image
    if (fs.existsSync(actualImagePath)) fs.unlinkSync(actualImagePath);

    if (!text || text.trim().length === 0) {
      return { text: "No text could be read from this image/PDF.", method: "OCR-Empty" };
    }

    console.log("OCR extraction successful");
    return { text: text.trim(), method: "OCR" };

  } catch (err) {
    console.error(" Extraction Process Failed:", err.message);
    return { text: "Error extracting text: " + err.message, method: "error" };
  }
}



//  Upload route
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {

  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded." });

    const { title } = req.body;
    const filePath = req.file.path;

    console.log(`Processing file: ${filePath}`);
  const { text: extractedText, method } = await extractText(filePath);

    const doc = await Document.create({
      title,
      filePath: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.id,
      textContent: extractedText,
        extractionMethod: method,
    });
console.log("Saving extracted text length:", extractedText.length);

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      document: doc,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all documents for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, documents: docs });
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ success: false, message: "Failed to fetch documents." });
  }
});
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// document.routes.js
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // 1. Database se delete karein
    await Document.findByIdAndDelete(req.params.id);

    // 2. Physical file ko uploads folder se delete karein (Optional but recommended)
    const filePath = path.join(__dirname, "..", doc.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});





export default router;
