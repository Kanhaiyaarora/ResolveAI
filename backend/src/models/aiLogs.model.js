const aiLogSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },

    query: String,
    retrievedDocs: [String],
    response: String,

    confidenceScore: Number,
    escalated: Boolean,

    latency: Number,
  },
  { timestamps: true },
);

export default mongoose.model("AiLog", aiLogSchema);
