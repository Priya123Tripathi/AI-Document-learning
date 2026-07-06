import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
let embeddingModel = null;

function getEmbeddingModel() {
  if (!embeddingModel) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in .env");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    embeddingModel = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
  }
  return embeddingModel;
}

export async function generateEmbedding(text) {
  try {
    const model = getEmbeddingModel();
    const result = await model.embedContent({
      content: { parts: [{ text }] },
      outputDimensionality: 768,
    });
    return result.embedding.values;
  } catch (err) {
    console.error("Embedding generation error:", err.message);
    throw new Error("Failed to generate embedding");
  }
}