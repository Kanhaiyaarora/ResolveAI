import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { CONFIG } from "./config/config.js";
import morgan from "morgan";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: CONFIG.GOOGLE_CLIENT_ID,
//       clientSecret: CONFIG.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       return done(null, profile);
//     },
//   ),
// );


// we use proxy in development to avoid CORS issues, so we don't need to enable CORS in the backend. In production, the frontend and backend will be served from the same origin, so CORS is not an issue either. If you want to enable CORS for development, you can uncomment the following code:

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );

// api endpoints


export default app;