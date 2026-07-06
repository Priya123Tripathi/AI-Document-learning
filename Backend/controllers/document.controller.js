import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import DocumentModule from "../models/Document.js";
import { extractText } from "../services/textExtraction.service.js";
import { ingestDocument } from "../services/ragService.js";

const Document = DocumentModule.default || DocumentModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(process.cwd(), "uploads");

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded." });

    const { title } = req.body;
    const filePath = req.file.path;

    console.log(`Processing file: ${filePath}`);
    const { text: extractedText, method } = await extractText(filePath, uploadDir);

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


       ingestDocument(doc._id, extractedText)
      .then(() => console.log(`RAG ingestion complete for document ${doc._id}`))
      .catch((err) => console.error(`RAG ingestion failed for document ${doc._id}:`, err.message));

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, documents: docs });
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ success: false, message: "Failed to fetch documents." });
  }
};

export const getDocumentById = async (req, res) => {
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
};

export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    await Document.findByIdAndDelete(req.params.id);

    const filePath = path.join(__dirname, "..", doc.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};