import { config } from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

// for environment variables
config();


// connect to database using custom file
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect with Data base", error);
  });
