import { processDocumentToVectors } from "../services/rag.service.js";
import { upsertVectors } from "../services/pinecone.service.js";
import KnowledgeBase from "../models/knowledgeBase.model.js";
import fs from "fs";

/**
 * Uploads a document, processes it using RAG pipeline (chunking + mistral embeddings),
 * and stores the resulting vectors in Pinecone under the tenant's namespace.
 */
export const uploadDocumentController = async (req, res) => {
    try {
        const file = req.file;
        const companyId = req.user.companyId;

        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        if (!companyId) {
            return res.status(401).json({ success: false, message: "Unauthorized. No company ID found." });
        }

        console.log(`Processing file: ${file.originalname} for company: ${companyId}`);

        // Read file from disk (multer saves it temporarily to /uploads)
        const fileBuffer = fs.readFileSync(file.path);

        // Define metadata for the chunks
        const metadata = {
            filename: file.originalname,
            uploadedBy: req.user._id.toString(),
            uploadDate: new Date().toISOString(),
        };

        // Process document into vectors (Extract -> Chunk -> Embed)
        const vectors = await processDocumentToVectors(fileBuffer, file.mimetype, metadata);

        // Upsert vectors to Pinecone under the company's namespace
        await upsertVectors(companyId.toString(), vectors);

        // Update MongoDB Knowledge Base record
        let kb = await KnowledgeBase.findOne({ tenantId: companyId });
        if (!kb) {
            kb = new KnowledgeBase({ tenantId: companyId, documents: [] });
        }

        kb.documents.push({
            title: file.originalname,
            url: file.path, // In a real app, upload this to S3/Cloudinary and save that URL
            uploadedBy: req.user._id,
        });

        await kb.save();

        // Clean up temporary file
        fs.unlinkSync(file.path);

        res.status(200).json({
            success: true,
            message: "Document successfully processed and added to Knowledge Base",
            chunksGenerated: vectors.length
        });

    } catch (error) {
        console.error("Error in uploadDocumentController:", error);
        
        // Ensure we clean up the file even if there is an error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while processing the document",
        });
    }
};
