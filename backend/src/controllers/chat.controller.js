import { generateRAGResponse } from "../services/ai.service.js";
import Customer from "../models/customer.model.js";
import Ticket from "../models/ticket.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

/**
 * Handles incoming customer messages to the AI bot from the website widget.
 * Auto-escalates to human agent by creating a ticket if AI cannot answer.
 */
export const handleBotChatController = async (req, res) => {
    try {
        // The widget passes companyId and a unique sessionId for the customer
        const { companyId, sessionId, message } = req.body;

        if (!companyId || !sessionId || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Generate AI response using RAG pipeline
        const aiResult = await generateRAGResponse(companyId, message);

        let ticket = null;

        // Auto-escalation logic if the AI lacks context
        if (aiResult.needsEscalation) {
            // Find or create customer based on sessionId
            let customer = await Customer.findOne({ sessionId, companyId });
            if (!customer) {
                customer = await Customer.create({ 
                    sessionId, 
                    companyId, 
                    name: "Visitor" 
                });
            }

            // Create a Conversation for the escalated chat
            const conversation = await Conversation.create({
                companyId,
                customerId: customer._id,
                status: "open",
                isAiActive: false,
                lastMessage: message,
                lastMessageAt: new Date()
            });

            // Create an open ticket for human agents to pick up, linked to conversation
            ticket = await Ticket.create({
                companyId,
                customerId: customer._id,
                conversationId: conversation._id,
                subject: "Escalated AI Chat",
                description: `AI failed to answer. Original query: "${message}"`,
                status: "open",
                priority: "high"
            });

            // Save the initial failed message to the conversation history
            await Message.create({
                conversationId: conversation._id,
                companyId,
                senderType: "customer",
                senderId: customer._id,
                senderModel: "Customer",
                content: message
            });
        }

        res.status(200).json({
            success: true,
            reply: aiResult.answer,
            escalated: aiResult.needsEscalation,
            ticketId: ticket ? ticket._id : null,
            conversationId: ticket ? ticket.conversationId : null
        });

    } catch (error) {
        console.error("Error in handleBotChatController:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET CHAT HISTORY (AGENT/ADMIN)
 * Fetches all messages for a given conversation.
 */
export const getChatHistoryController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId })
            .populate("senderId", "name email") // Populates agent/customer details
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET ACTIVE CONVERSATIONS (AGENT/ADMIN)
 * Fetches escalated, open conversations for the agent's dashboard.
 */
export const getActiveConversationsController = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const conversations = await Conversation.find({ 
            companyId, 
            status: { $in: ["open", "pending"] },
            isAiActive: false 
        })
        .populate("customerId", "name email")
        .sort({ lastMessageAt: -1 });

        res.status(200).json({
            success: true,
            count: conversations.length,
            conversations
        });
    } catch (error) {
        console.error("Error fetching active conversations:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
