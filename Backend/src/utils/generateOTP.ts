import crypto from "crypto";

export const generateOTP = (length = 6): string => {
  const buffer = crypto.randomBytes(length);
  const otp = buffer.toString("hex").slice(0, length);
  return otp.toUpperCase();
};
