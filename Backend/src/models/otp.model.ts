import mongoose from "mongoose";
import { IOTP } from "../types/IOtp.js";

const otpSchema = new mongoose.Schema<IOTP>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt:{
    type:Date,
    required:true
  }
});

export default mongoose.model("OTP",otpSchema);