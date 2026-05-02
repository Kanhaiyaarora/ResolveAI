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
      color: { type: String, default: "#000000" },
      position: { type: String, enum: ["left", "right"], default: "right" },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Company", companySchema);
