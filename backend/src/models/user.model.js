import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["superadmin", "admin", "agent"], // superadmin is for future
      default: "agent",
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },

    // 🔥 Agent specific features
    agentDetails: {
      isAvailable: { type: Boolean, default: true },
      maxActiveChats: { type: Number, default: 5 },
      currentActiveChats: { type: Number, default: 0 },
      skills: [String],
      lastAssignedAt: Date,
    },

    isOnline: { type: Boolean, default: false },
    lastSeen: Date,

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ companyId: 1 });

export default mongoose.model("User", userSchema);
