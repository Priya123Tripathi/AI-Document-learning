import { Pinecone } from "@pinecone-database/pinecone";

let pineconeClient = null;
let pineconeIndex = null;

export function getPineconeIndex() {
  if (!pineconeIndex) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY is missing in .env");
    }

    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    pineconeIndex = pineconeClient.index("nodejs");

    console.log("Pinecone client initialized, connected to index: nodejs");
  }

  return pineconeIndex;
}