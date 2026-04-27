import mongoose from "mongoose";
import { CONFIG } from "./config.js";

export const connectToDb = async () => {
  try {
    await mongoose.connect(CONFIG.MONGO_URI);
    console.log("Mongodb connected successfully.✅");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
