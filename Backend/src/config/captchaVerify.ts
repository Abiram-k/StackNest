import axios from "axios";
import { config } from "dotenv";
config()

export const verifyCaptcha = async (captchaToken: string) => {
const captchaResponse = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      },
    }
  );
  return captchaResponse.data.success;
}