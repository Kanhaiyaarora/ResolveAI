import { Router } from "express";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../validators/auth.validator.js";

import {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  getAgentsController,
} from "../controllers/auth.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const authRouter = Router();


// 🔐 /api/auth/register
authRouter.post("/register", validateRegisterUser, registerUserController);


// 🔑 /api/auth/login
authRouter.post("/login", validateLoginUser, loginUserController);


// 🚪 /api/auth/logout (protected)
authRouter.post("/logout", authenticateUser, logoutUserController);


// 👤 /api/auth/me (protected)
authRouter.get("/me", authenticateUser, getMeController);


// 👥 /api/auth/agents (ADMIN ONLY)
authRouter.get("/agents", authenticateUser, authorizeRoles("admin"), getAgentsController);


export default authRouter;