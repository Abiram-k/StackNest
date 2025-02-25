import { config } from "dotenv";
import mongoose from "mongoose";
config();

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING as string;

export const connectDB = async () =>{
    try {
        await mongoose.connect(MONGO_CONNECTION_STRING);
        console.log("Successfully connected to mongodb");
    } catch (error:any) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}