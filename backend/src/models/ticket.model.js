import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
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

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },

    subject: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },

    // 🔥 MULTIPLE AGENTS SUPPORT
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    tags: {
      type: [String],
      default: [],
    },

    slaDeadline: {
      type: Date,
      index: true, // useful for SLA tracking
    },

    //  TRACK WHO CREATED TICKET 

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);


// COMPOUND INDEX (important for performance)
ticketSchema.index({ companyId: 1, status: 1 });

//  OPTIONAL: sort by priority + SLA
ticketSchema.index({ priority: 1, slaDeadline: 1 });

export default mongoose.model("Ticket", ticketSchema);
