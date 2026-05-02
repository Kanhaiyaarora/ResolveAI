import { ChatMistralAI } from "@langchain/mistralai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { CONFIG } from "../config/config.js";
import { embedQuery } from "./rag.service.js";
import { queryVectors } from "./pinecone.service.js";

// Initialize Mistral LLM for conversational responses
const model = new ChatMistralAI({
    apiKey: CONFIG.MISTRAL_API_KEY,
    model: "mistral-large-latest", // Default Mistral model
    temperature: 0.2, // Low temperature for more factual, document-based answers
});

const promptTemplate = PromptTemplate.fromTemplate(`
You are an AI customer support assistant for a business.
Use the following context to answer the user's question accurately.
If the context does not contain the answer, say exactly: "I'm sorry, I don't have enough information to answer that. Let me connect you to a human agent."

Context:
{context}

Question:
{question}

Answer:
`);

/**
 * Handles generating an AI response using Pinecone RAG Context.
 * 
 * @param {string} tenantId - The company ID (namespace)
 * @param {string} query - The customer's question
 * @returns {Object} - Object containing the answer and escalation flag
 */
export const generateRAGResponse = async (tenantId, query) => {
    try {
        // 1. Embed the user query to find similar vectors
        const queryEmbedding = await embedQuery(query);

        // 2. Query Pinecone for the top 3 most relevant context chunks
        const searchResults = await queryVectors(tenantId.toString(), queryEmbedding, 3);

        // 3. Extract text from the Pinecone metadata
        const contextChunks = searchResults.matches.map(match => match.metadata.text);
        const combinedContext = contextChunks.join("\n\n");

        // 4. Create the LangChain pipeline and generate the answer
        const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

        const response = await chain.invoke({
            context: combinedContext,
            question: query,
        });

        // 5. Determine if human escalation is needed based on the bot's response
        const needsEscalation = response.includes("Let me connect you to a human agent");

        return {
            answer: response,
            needsEscalation,
        };

    } catch (error) {
        console.error("Error generating AI response:", error);
        throw new Error("Failed to generate AI response.");
    }
};
