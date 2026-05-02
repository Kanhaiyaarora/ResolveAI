import { Router } from "express";
import { handleBotChatController, getChatHistoryController, getActiveConversationsController } from "../controllers/chat.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const chatRouter = Router();

// 🤖 WIDGET BOT ENDPOINT (Public, used by customer widget)
chatRouter.post("/bot", handleBotChatController);

// 📜 GET CHAT HISTORY (Protected for Agents/Admins)
chatRouter.get("/:conversationId/history", authenticateUser, authorizeRoles("agent", "admin"), getChatHistoryController);

// 💬 GET ACTIVE CONVERSATIONS (Protected for Agents/Admins)
chatRouter.get("/active", authenticateUser, authorizeRoles("agent", "admin"), getActiveConversationsController);

export default chatRouter;
