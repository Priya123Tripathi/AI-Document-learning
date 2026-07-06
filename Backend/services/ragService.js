import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateEmbedding } from "./embeddingService.js";
import { getPineconeIndex } from "./pineconeClient.js";

// Document ko chunks mein todke, embed karke, Pinecone mein store karta hai
export async function ingestDocument(documentId, textContent) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
    });

    const chunks = await splitter.splitText(textContent);
    console.log(`Document split into ${chunks.length} chunks`);

    const index = getPineconeIndex();
    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);

      vectors.push({
        id: `${documentId}-chunk-${i}`,
        values: embedding,
        metadata: {
          documentId: documentId.toString(),
          chunkIndex: i,
          text: chunks[i],
        },
      });
    }

     console.log("Vectors array length before upsert:", vectors.length);
    console.log("Sample vector:", JSON.stringify(vectors[0])?.slice(0, 200))
 
       await index.upsert({ records: vectors });

    console.log(`Ingested ${vectors.length} chunks for document ${documentId}`);
    return { success: true, chunksCount: vectors.length };

  } catch (err) {
    console.error("Ingestion error:", err.message);
    throw new Error("Failed to ingest document into vector store");
  }
}
// User ke query ke liye relevant chunks Pinecone se retrieve karta hai
export async function retrieveContext(documentId, query, topK = 5) {
  try {
    // Step 1: Query ka embedding banao
    const queryEmbedding = await generateEmbedding(query);

    // Step 2: Pinecone mein search karo, sirf isi documentId ke chunks mein
    const index = getPineconeIndex();

    const results = await index.query({
      vector: queryEmbedding,
      topK: topK,
      filter: { documentId: documentId.toString() },
      includeMetadata: true,
    });

    // Step 3: Matches se sirf text nikalo aur ek context string bana do
    const relevantChunks = results.matches.map((match) => match.metadata.text);

    const context = relevantChunks.join("\n\n---\n\n");

    return context;

  } catch (err) {
    console.error("Retrieval error:", err.message);
    throw new Error("Failed to retrieve context from vector store");
  }
}