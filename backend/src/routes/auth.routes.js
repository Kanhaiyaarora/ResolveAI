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
} from "../controllers/auth.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();


// 🔐 /api/auth/register
authRouter.post("/register", validateRegisterUser, registerUserController);


// 🔑 /api/auth/login
authRouter.post("/login", validateLoginUser, loginUserController);


// 🚪 /api/auth/logout (protected)
authRouter.post("/logout", authenticateUser, logoutUserController);


// 👤 /api/auth/me (protected)
authRouter.get("/me", authenticateUser, getMeController);


export default authRouter;