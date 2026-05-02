import mongoose from "mongoose";

const knowledgeBaseSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: String,

    content: { type: String, required: true },

    pineconeId: String, // vector reference

    type: {
      type: String,
      enum: ["faq", "doc", "policy"],
      default: "faq",
    },

    tags: [String],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

knowledgeBaseSchema.index({ companyId: 1 });

export default mongoose.model("KnowledgeBase", knowledgeBaseSchema);
