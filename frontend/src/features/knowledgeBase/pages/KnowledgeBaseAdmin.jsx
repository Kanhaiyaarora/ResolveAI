import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  FileType,
  X,
  CheckCircle2,
  Database,
  Loader2,
  BookOpen,
} from "lucide-react";
import { uploadDocument } from "../service/knowledgeBase.api";
import Button from "../../auth/components/Button";
import toast, { Toaster } from "react-hot-toast";

const ACCEPTED_TYPES = {
  "application/pdf": { ext: "PDF", color: "text-red-400", bg: "bg-red-500/10" },
  "text/plain": { ext: "TXT", color: "text-blue-400", bg: "bg-blue-500/10" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    ext: "DOCX",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const KnowledgeBaseAdmin = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  const addFiles = useCallback((newFiles) => {
    const valid = Array.from(newFiles).filter((f) => {
      if (!ACCEPTED_TYPES[f.type]) {
        toast.error(`"${f.name}" is not a supported file type.`);
        return false;
      }
      return true;
    });

    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !existingNames.has(f.name))];
    });
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeFile = (name) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleUpload = async () => {
    if (!files.length) {
      toast.error("Please select at least one file to upload.");
      return;
    }
    setIsUploading(true);
    setUploadResults([]);
    const results = [];

    for (const file of files) {
      try {
        const data = await uploadDocument(file);
        results.push({ name: file.name, success: true, chunks: data.chunksGenerated });
        toast.success(`"${file.name}" → ${data.chunksGenerated} vectors created!`);
      } catch (err) {
        const msg = err?.response?.data?.message || "Upload failed.";
        results.push({ name: file.name, success: false, error: msg });
        toast.error(`"${file.name}" failed: ${msg}`);
      }
    }

    setUploadResults(results);
    setFiles([]);
    setIsUploading(false);
  };

  return (
    <div className="space-y-8">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#e2e8f0",
            border: "1px solid #1e293b",
            borderRadius: "12px",
          },
        }}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Knowledge Base</h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload documents to train your AI support bot. Supports PDF, TXT, and DOCX.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-semibold">
          <Database size={16} />
          AI-Powered RAG
        </div>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 flex items-start gap-4"
      >
        <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen size={18} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">How it works</p>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Documents are automatically extracted, chunked into segments, and embedded as
            semantic vectors into your company's private Pinecone namespace. Your AI bot then
            uses these vectors to answer customer questions accurately.
          </p>
        </div>
      </motion.div>

      {/* Drag & Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-emerald-500 bg-emerald-500/5 scale-[1.01]"
            : "border-slate-700 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50"
        } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.docx"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />

        <motion.div
          animate={isDragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
          className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4"
        >
          <UploadCloud
            size={28}
            className={isDragging ? "text-emerald-400" : "text-slate-400"}
          />
        </motion.div>

        <p className="text-white font-semibold text-lg">
          {isDragging ? "Drop your files here" : "Drag & drop files here"}
        </p>
        <p className="text-slate-500 text-sm mt-2">
          or{" "}
          <span className="text-emerald-400 font-semibold hover:underline">
            browse to choose
          </span>
        </p>
        <p className="text-slate-600 text-xs mt-3 font-medium uppercase tracking-widest">
          PDF · TXT · DOCX supported
        </p>
      </motion.div>

      {/* Selected Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            key="file-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
              Selected Files ({files.length})
            </h3>

            <div className="space-y-2">
              {files.map((file, i) => {
                const meta = ACCEPTED_TYPES[file.type] || { ext: "FILE", color: "text-slate-400", bg: "bg-slate-800" };
                return (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 group"
                  >
                    <div className={`${meta.bg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                      <FileText size={18} className={meta.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{file.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {meta.ext} · {formatBytes(file.size)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.name);
                      }}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-2">
              <Button onClick={handleUpload} isLoading={isUploading} className="sm:w-auto px-8">
                {isUploading ? (
                  "Vectorizing..."
                ) : (
                  <>
                    <UploadCloud size={18} />
                    Upload & Train AI
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Results */}
      <AnimatePresence>
        {uploadResults.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
              Upload Results
            </h3>
            <div className="space-y-2">
              {uploadResults.map((result, i) => (
                <motion.div
                  key={result.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3 border ${
                    result.success
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      result.success ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <X size={18} className="text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{result.name}</p>
                    <p
                      className={`text-xs mt-0.5 ${
                        result.success ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {result.success
                        ? `${result.chunks} vector chunks added to AI knowledge base`
                        : result.error}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KnowledgeBaseAdmin;
