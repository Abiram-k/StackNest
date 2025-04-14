import SideBar from "@/components/SideBar";
import { useGetNotification } from "@/hooks/user/connection/useGetNotification";
import {
  BarChart2,
  Bell,
  Crown,
  FileText,
  Home,
  Settings,
  Users,
} from "lucide-react";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  const { data: notificationData } = useGetNotification();
  const navItems = [
    {
      name: "Profile",
      icon: <Home className="h-5 w-5" />,
      to: "/user/profile",
    },
    {
      name: "Stats",
      icon: <BarChart2 className="h-5 w-5" />,
      to: "/user/profile/stats",
    },
    {
      name: "Posts",
      icon: <FileText className="h-5 w-5" />,
      to: "/user/profile/my-feeds",
    },
    {
      name: "Friends",
      icon: <Users className="h-5 w-5" />,
      to: "/user/profile/friends",
    },
    {
      name: "Premium plans",
      icon: <Crown className="h-5 w-5" />,
      to: "/user/profile/premium-plans",
    },
    {
      name: (
        <p className="relative inline-flex items-center">
          Notification
          {notificationData?.notifications &&
            notificationData.notifications.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                {notificationData.notifications.length}
              </span>
            )}
        </p>
      ),
      icon: <Bell className="w-5 h-5" />,
      to: "/user/profile/notification",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      to: "/user/profile/settings",
    },
  ];
  return (
    <div className="flex md:gap-90">
      <SideBar navItems={navItems} role="user" />
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
