import { Router } from "express";
import multer from "multer";
import { uploadDocumentController } from "../controllers/knowledgeBase.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import fs from "fs";
import path from "path";

const kbRouter = Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads (PDF, DOCX, TXT)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "application/pdf", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
        "application/msword", 
        "text/plain"
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF, DOCX, and TXT are allowed."), false);
    }
};

const upload = multer({ storage, fileFilter });

// 📄 UPLOAD DOCUMENT TO KNOWLEDGE BASE (ADMIN ONLY)
kbRouter.post(
    "/upload", 
    authenticateUser, 
    authorizeRoles("admin"), 
    upload.single("document"), 
    uploadDocumentController
);

export default kbRouter;
