import app from "./src/app.js";
import { connectToDb } from "./src/config/database.js";
import { initSocket } from "./src/services/socket.service.js";
import http from "http";
import dns from "node:dns/promises"
dns.setServers(["8.8.8.8", "1.1.1.1"])

const server = http.createServer(app);

const serverStarted = () => {
  try {
    initSocket(server); // Attach socket.io
    
    server.listen(3000, () => {
      console.log(" Server 🚀 Started🔥 running at port-3000 with Socket.io");
    });
    connectToDb();
  } catch (error) {
    console.log(error);
  }
};

serverStarted();