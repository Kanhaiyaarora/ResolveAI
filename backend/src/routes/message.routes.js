import { Router } from "express";
import { getMessagesController, sendMessageController } from "../controllers/message.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const messageRouter = Router();

messageRouter.get("/:ticketId", authenticateUser, getMessagesController);
messageRouter.post("/", authenticateUser, sendMessageController);

export default messageRouter;
