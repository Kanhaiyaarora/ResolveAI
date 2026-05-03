import mongoose from "mongoose";
import crypto from "crypto";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,

    apiKey: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(16).toString("hex"),
    },

    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },

    aiSettings: {
      enabled: { type: Boolean, default: true },
      autoEscalation: { type: Boolean, default: true },
      confidenceThreshold: { type: Number, default: 0.6 },
    },

    widgetSettings: {
      primaryColor: { type: String, default: "#10b981" },
      position: { type: String, enum: ["left", "right"], default: "right" },
      welcomeMessage: { type: String, default: "Hi there! How can I help you today?" },
      botName: { type: String, default: "Support Bot" },
      logoUrl: { type: String, default: "" },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Company", companySchema);
