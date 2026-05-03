import { Router } from "express";
import { 
    handleBotChatController, 
    getChatHistoryController, 
    getActiveConversationsController,
    sendCustomerMessageController,
    getCustomerChatHistoryController
} from "../controllers/chat.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const chatRouter = Router();

// 🤖 WIDGET BOT ENDPOINT (Public, used by customer widget)
chatRouter.post("/bot", handleBotChatController);

// 📜 PUBLIC HISTORY FOR CUSTOMER (Used by widget on reload)
chatRouter.get("/customer-history/:sessionId", getCustomerChatHistoryController);

// 📜 GET CHAT HISTORY (Protected for Agents/Admins)
chatRouter.get("/:conversationId/history", authenticateUser, authorizeRoles("agent", "admin"), getChatHistoryController);

// 💬 SEND MESSAGE TO CUSTOMER (Protected for Agents/Admins)
chatRouter.post("/:conversationId/message", authenticateUser, authorizeRoles("agent", "admin"), sendCustomerMessageController);

// 💬 GET ACTIVE CONVERSATIONS (Protected for Agents/Admins)
chatRouter.get("/active", authenticateUser, authorizeRoles("agent", "admin"), getActiveConversationsController);

export default chatRouter;
