import { config } from "dotenv";
config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing in environment variable");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variable");
}
if (!process.env.JWT_EXPIRE) {
  throw new Error("JWT_EXPIRE is missing in environment variable");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is missing in environment variable");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET is missing in environment variable");
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error("IMAGEKIT_PRIVATE_KEY is missing in environment variable");
}

export const CONFIG = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
};
