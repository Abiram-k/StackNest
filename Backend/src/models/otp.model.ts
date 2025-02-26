import mongoose from "mongoose";
import { IOTP } from "../interfaces/IOtp";

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