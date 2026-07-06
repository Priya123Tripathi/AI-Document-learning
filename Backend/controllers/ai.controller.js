import axios from "axios";
import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import mongoose from "mongoose";
import { retrieveContext } from "../services/ragService.js";

export const handleAiAction = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const { documentId, question, type, concept, content } = req.body;

  try {
    const doc = await Document.findById(documentId);
    if (!doc || !doc.textContent) {
      return res.status(404).json({ success: false, message: "Document text missing." });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    

    let prompt = "";

    if (type === "chat") {

      // RAG: sirf relevant chunks retrieve karega, poora document nahi
       const context = await retrieveContext(documentId, question);

      prompt = `
      You are a helpful AI Study Assistant. Use the document content below to answer the user's question.
      
       RELEVANT CONTEXT:
      ${context}

      USER QUESTION:
      ${question}
    `;
    }

    if (type === "summary") {

      prompt = `
Summarize the following document in simple bullet points.

DOCUMENT:
${doc.textContent.slice(0, 20000)}
`;
    }

    if (type === "explain") {

               const context = await retrieveContext(documentId, concept);

      prompt = `
Explain the concept "${concept}" using the document below.

RELEVANT CONTEXT:
${context}
`;
    }

    if (type === "Flashcard") {
      prompt = `
Generate flashcards.

Return ONLY JSON array format:
[
 { "question":"", "answer":"" }
]

Do not include markdown or explanation.

Content:
${doc.textContent.slice(0, 20000)}
`;
    }

    console.log("Sending request to Gemini (v1 Flash)...");

    const resp = await axios.post(
      apiUrl,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const answer = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (type === "Flashcard" && answer) {
      const cleaned = answer.replace(/```json|```/g, "");

      let cards = [];
      try {
        cards = JSON.parse(cleaned);
      } catch (err) {
        console.error("JSON Parse Error:", err);
        return res.status(500).json({
          success: false,
          message: "AI returned invalid JSON",
        });
      }

      let savedSet = null;

      if (cards.length > 0) {
        savedSet = await Flashcard.create({
          documentId,
          cards,
          userId: new mongoose.Types.ObjectId(req.user.id),
        });
      }

      return res.json({
        success: true,
        data: savedSet,
      });
    }

    if (answer) {
      console.log("Gemini Success!");
      return res.json({ success: true, answer: answer });
    } else {
      return res.status(500).json({ success: false, message: "Empty response from Gemini." });
    }
  } catch (err) {
    console.error("Gemini Error Details:", err.response?.data || err.message);

    const errorMessage = err.response?.data?.error?.message || "AI Connection Issue";
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};