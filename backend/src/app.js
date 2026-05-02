import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { CONFIG } from "./config/config.js";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import kbRouter from "./routes/knowledgeBase.routes.js";
import chatRouter from "./routes/chat.routes.js";


const app = express();

// middlewares
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL if different
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));


// api endpoints
app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/knowledge-base", kbRouter);
app.use("/api/chat", chatRouter);

passport.use(
  new GoogleStrategy(
    {
      clientID: CONFIG.GOOGLE_CLIENT_ID,
      clientSecret: CONFIG.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);


export default app;
