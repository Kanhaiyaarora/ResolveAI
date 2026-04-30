import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    name: String,
    email: String,

    metadata: {
      ip: String,
      userAgent: String,
    },

    lastSeen: Date,
  },
  { timestamps: true },
);

customerSchema.index({ sessionId: 1, companyId: 1 });

export default mongoose.model("Customer", customerSchema);
