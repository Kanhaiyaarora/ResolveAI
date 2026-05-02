import { pineconeIndex } from "../config/pinecone.js";

/**
 * Upserts an array of vectors to a specific namespace in Pinecone.
 * Using companyId as the namespace guarantees multi-tenant data isolation.
 * 
 * @param {string} namespace - The tenant/company ID
 * @param {Array} vectors - Array of objects containing { id, values, metadata }
 */
export const upsertVectors = async (namespace, vectors) => {
    try {
        const index = pineconeIndex.namespace(namespace);
        await index.upsert({ records: vectors });
        console.log(`Successfully upserted ${vectors.length} vectors to namespace ${namespace}`);
    } catch (error) {
        console.error("Error in Pinecone upsertVectors:", error);
        throw error;
    }
};

/**
 * Queries the vector database for similar chunks based on an input vector.
 * Limits the search to the specific tenant's namespace.
 * 
 * @param {string} namespace - The tenant/company ID
 * @param {Array} queryVector - The embedding of the user's query
 * @param {number} topK - Number of top matches to retrieve
 * @returns {Object} Query results with metadata
 */
export const queryVectors = async (namespace, queryVector, topK = 5) => {
    try {
        const index = pineconeIndex.namespace(namespace);
        const results = await index.query({
            vector: queryVector,
            topK,
            includeMetadata: true,
        });
        return results;
    } catch (error) {
        console.error("Error in Pinecone queryVectors:", error);
        throw error;
    }
};
