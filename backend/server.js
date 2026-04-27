import app from "./src/app.js";
import { connectToDb } from "./src/config/database.js";

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