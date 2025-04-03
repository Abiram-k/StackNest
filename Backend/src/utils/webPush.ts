import webPush from "web-push";
import { config } from "dotenv";
config();

const EMAIL_USER = process.env.EMAIL_USER;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

export const configureWebPush = () => {
  webPush.setVapidDetails(
    `mailto:${EMAIL_USER}`,
    VAPID_PUBLIC_KEY!,
    VAPID_PRIVATE_KEY!
  );
};
configureWebPush();
export const sendNotification = async (
  subscription: webPush.PushSubscription,
  payload: any
) => {
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error("Error sending notification: ", error);
  }
};
