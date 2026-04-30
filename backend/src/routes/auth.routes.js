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
import passport from "passport";

const authRouter = Router();

authRouter.post("/register", validateRegisterUser, registerUserController);

// complete route /api/auth/login
authRouter.post("/login", validateLoginUser, loginUserController);

// complete route /api/auth/google
// authRouter.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] }),
// );

// complete route /api/auth/google/callback
// authRouter.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   googleAuthController,
// );

// complete route /api/auth/logout
authRouter.post("/logout", logoutUserController);

// complete route /api/auth/me
// authRouter.get("/me", authenticateUser, getMeController);

export default authRouter;
