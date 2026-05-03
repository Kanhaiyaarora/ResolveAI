import { Router } from "express";
import { getAiSuggestionsController } from "../controllers/ai.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const aiRouter = Router();

aiRouter.post("/suggest-reply", authenticateUser, getAiSuggestionsController);

export default aiRouter;
