import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    senderType: {
      type: String,
      enum: ["customer", "agent", "ai"],
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
    },

    senderModel: {
      type: String,
      enum: ["Customer", "User"],
    },

    content: { type: String, required: true },

    attachments: [
      {
        url: String,
        type: String,
        size: Number,
      },
    ],

    metadata: {
      sentiment: String,
      confidence: Number,
    },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ companyId: 1 });

export default mongoose.model("Message", messageSchema);
