import app from "./src/app.js";
import { connectToDb } from "./src/config/database.js";
import dns from "node:dns/promises"
dns.setServers(["8.8.8.8", "1.1.1.1"])

const serverStarted = () => {
  try {
    app.listen(3000, () => {
      console.log(" Server 🚀 Started 🔥");
    });
    connectToDb();
  } catch (error) {
    console.log(error);
  }
};

serverStarted();