import { config } from "dotenv";
import server from "./app.js";
import { connectDB } from "./config/db.js";
// import { connectDB } from "./config/db";

// for environment variables
config();

// connect to database using custom file
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect with Data base", error);
  });

const exitHandler = (signal: string) => {
  console.log(`⚠️ Received ${signal}. Closing app...`);
  process.exit(0);
};

process.on("SIGINT", () => exitHandler("SIGINT"));
