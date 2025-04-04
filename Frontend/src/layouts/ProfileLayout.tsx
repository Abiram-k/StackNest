import SideBar from "@/components/SideBar";
import {
  BarChart2,
  Bell,
  Crown,
  FileText,
  Home,
  Layout,
  Settings,
  Users,
} from "lucide-react";
import { Outlet } from "react-router-dom";

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
    to: "/user/profile/premium",
  },
  {
    name: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    to: "/admin/notification",
  },
  {
    name: "Settings",
    icon: <Settings className="h-5 w-5" />,
    to: "/user/profile/settings",
  },
];

const ProfileLayout = () => {
  return (
    <div className="flex md:gap-90">
      <SideBar navItems={navItems} role="user" />
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
