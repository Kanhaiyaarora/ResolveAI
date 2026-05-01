import { Pinecone } from '@pinecone-database/pinecone';
import { CONFIG } from './config.js';

export const pc = new Pinecone({
  apiKey: CONFIG.PINECONE_API_KEY,
});

export const pineconeIndex = pc.index(CONFIG.PINECONE_INDEX_NAME); 