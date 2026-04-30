import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    // 🔥 MULTIPLE AGENTS SUPPORT
    assignedAgents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["open", "pending", "closed"],
      default: "open",
      index: true,
    },

    isAiActive: { type: Boolean, default: true },

    lastMessage: String,
    lastMessageAt: { type: Date, index: true },

    unreadCount: {
      agent: { type: Number, default: 0 },
      customer: { type: Number, default: 0 },
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    tags: [String],
  },
  { timestamps: true },
);

conversationSchema.index({ companyId: 1, status: 1 });
conversationSchema.index({ assignedAgents: 1 });

export default mongoose.model("Conversation", conversationSchema);
