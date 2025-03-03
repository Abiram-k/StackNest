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
  { name: "Stats", icon: <BarChart2 className="h-5 w-5" />, to: "/user/stats" },
  {
    name: "Posts",
    icon: <FileText className="h-5 w-5" />,
    to: "/user/posts",
  },
  {
    name: "Rooms",
    icon: <Layout className="h-5 w-5" />,
    to: "/user/rooms",
  },
  { name: "Rooms", icon: <Home className="w-5 h-5" />, to: "/admin/rooms" },
  {
    name: "Friends",
    icon: <Users className="h-5 w-5" />,
    to: "/user/friends",
  },
  {
    name: "Daily challenge",
    icon: <Crown className="h-5 w-5" />,
    to: "/user/premium",
  },
  {
    name: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    to: "/admin/notification",
  },
  {
    name: "Settings",
    icon: <Settings className="h-5 w-5" />,
    to: "/user/settings",
  },
];

const ProfileLayout = () => {
  return (
    <div className="flex md:gap-90">
      <SideBar navItems={navItems}/>
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
