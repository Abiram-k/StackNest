import { HttpService } from "@/api/httpService";
import { NotificationService } from "@/api/public/notificationService";
import { useEffect, createContext, useContext, useState } from "react";
import { toast } from "sonner";

const VITE_VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
interface NotificationContextType {
  permission: NotificationPermission | null;
  requestPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  permission: null,
  requestPermission: async () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null
  );

  const httpService = new HttpService();
  const notificationService = new NotificationService(httpService);

  // useEffect(() => {
  const registerServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) {
      toast.warning("This browser does not support notifications");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      let existingSubscription =
        await registration.pushManager.getSubscription();

      if (existingSubscription) {
        await notificationService.subscribeUser(existingSubscription);
        return;
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VITE_VAPID_PUBLIC_KEY,
      });

      await notificationService.subscribeUser(newSubscription);
      toast.success("Subscribed to notifications successfully!");
    } catch (error) {
      toast.error("Error occurred while registering service worker");
      console.error("Service Worker Error:", error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const current = Notification.permission;
      if (current === "denied") {
        toast.info("You have blocked notifications. Please enable it in your browser settings.");
        return;
      }
      const permission = await Notification.requestPermission();
      setPermission(permission);
      if (permission === "granted") {
        await registerServiceWorker();
      } else {
        toast.warning("Notification permission denied");
      }
    } catch (error) {
      console.error("Notification Permission Error:", error);
    }
  };

  //   requestNotificationPermission();
  // }, []);

  useEffect(() => {
    // requestNotificationPermission();
    setPermission(Notification.permission);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ permission, requestPermission: requestNotificationPermission }}
    >
      {children}
    </NotificationContext.Provider>
  );
  // return null
};
