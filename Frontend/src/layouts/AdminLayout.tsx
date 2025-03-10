import Navbar from "@/components/user/Navbar";
import SideBar from "@/components/SideBar";
import {
  Bell,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Flag,
  Globe,
  Home,
  LayoutGrid,
  Users,
} from "lucide-react";
import { Outlet } from "react-router-dom";

const navItems = [
  {
    name: "Dashboard",
    icon: <LayoutGrid className="w-5 h-5" />,
    to: "/admin/dashboard",
  },
  {
    name: "Users",
    icon: <Users className="w-5 h-5" />,
    to: "/admin/user-management",
  },
  {
    name: "Premium Plans",
    icon: <CreditCard className="w-5 h-5" />,
    to: "/admin/plans",
  },
  {
    name: "Banners",
    icon: <Flag className="w-5 h-5" />,
    to: "/admni/banners",
  },
  {
    name: "Rooms",
    icon: <Home className="w-5 h-5" />,
    to: "/admin/room-management",
  },
  {
    name: "Payments",
    icon: <DollarSign className="w-5 h-5" />,
    to: "/admin/payments",
  },
  {
    name: "Daily challenge",
    icon: <Calendar className="w-5 h-5" />,
    to: "/admin/daily-challenge",
  },
  {
    name: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    to: "/admin/notification",
  },
  {
    name: "Reports",
    icon: <FileText className="w-5 h-5" />,
    to: "/admin/reports",
  },
  { name: "Feeds", icon: <Globe className="w-5 h-5" />, to: "/admin/feeds" },
];

const AdminLayout = () => {
  return (
    <>
      <Navbar isAuthintacted={true} isAdmin={true} />
      <SideBar navItems={navItems} role="admin" />
      <div className="bg-white dark:bg-black w-screen px-7 md:px-10 mt-18 md:ps-30 ">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
