import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { CONFIG } from "../config/config.js";
import { createRequire } from "module";
import { v4 as uuidv4 } from "uuid";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");


// Initialize Mistral Embeddings
const embeddings = new MistralAIEmbeddings({
    apiKey: CONFIG.MISTRAL_API_KEY,
});

/**
 * Extracts text from various file formats (PDF, DOCX, TXT)
 */
export const extractTextFromFile = async (buffer, mimetype) => {
    try {
        if (mimetype === "application/pdf") {
            const data = await pdfParse(buffer);
            return data.text;
        } else if (
            mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            mimetype === "application/msword"
        ) {
            const data = await mammoth.extractRawText({ buffer });
            return data.value;
        } else if (mimetype === "text/plain") {
            return buffer.toString("utf-8");
        } else {
            throw new Error("Unsupported file type");
        }
    } catch (error) {
        console.error("Error extracting text from file:", error);
        throw new Error("Failed to parse document");
    }
};

/**
 * Splits extracted text into smaller chunks
 */
export const chunkText = async (text, chunkSize = 1000, chunkOverlap = 200) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
    });
    const chunks = await splitter.createDocuments([text]);
    return chunks.map(chunk => chunk.pageContent);
};

/**
 * Processes a file: Extracts text, chunks it, generates embeddings, 
 * and formats it for Pinecone insertion.
 * 
 * @param {Buffer} fileBuffer - The file content
 * @param {string} mimetype - The file MIME type
 * @param {Object} metadata - Base metadata to attach (like filename, documentId)
 * @returns {Array} Array of vector objects ready for Pinecone
 */
export const processDocumentToVectors = async (fileBuffer, mimetype, metadata = {}) => {
    // 1. Extract
    const text = await extractTextFromFile(fileBuffer, mimetype);
    if (!text || text.trim().length === 0) {
        throw new Error("Document is empty or could not be read");
    }

    // 2. Chunk
    const chunks = await chunkText(text);

    // 3. Embed all chunks using Mistral
    const vectorObjects = [];
    
    // Process in batches if there are many chunks to prevent rate limiting, 
    // but for simple documents doing it all at once or in a loop is fine.
    for (let i = 0; i < chunks.length; i++) {
        const chunkTextContent = chunks[i];
        
        // Generate embedding array
        const [vector] = await embeddings.embedDocuments([chunkTextContent]);
        
        vectorObjects.push({
            id: uuidv4(),
            values: vector,
            metadata: {
                ...metadata,
                text: chunkTextContent,
                chunkIndex: i,
            }
        });
    }

    return vectorObjects;
};

/**
 * Generates an embedding for a single user query.
 */
export const embedQuery = async (queryText) => {
    const vector = await embeddings.embedQuery(queryText);
    return vector;
};
