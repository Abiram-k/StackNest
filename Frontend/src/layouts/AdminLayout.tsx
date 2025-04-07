import Navbar from "@/components/user/Navbar";
import SideBar from "@/components/SideBar";
import {
  AlertCircle,
  BadgeCheck,
  Calendar,
  CreditCard,
  Flag,
  Gift,
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
    to: "/admin/plans-management",
  },
  {
    name: "Benefits ",
    icon: <BadgeCheck className="w-5 h-5" />,
    to: "/admin/benefits-management",
  },
  {
    name: "Points Rewards",
    icon: <Gift className="w-5 h-5" />,
    to: "/admin/rewards-management",
  },
  {
    name: "Feeds",
    icon: <Globe className="w-5 h-5" />,
    to: "/admin/feed-management",
  },
  {
    name: "Banners",
    icon: <Flag className="w-5 h-5" />,
    to: "/admin/banner-management",
  },
  {
    name: "Rooms",
    icon: <Home className="w-5 h-5" />,
    to: "/admin/room-management",
  },
  {
    name: "Daily challenge",
    icon: <Calendar className="w-5 h-5" />,
    to: "/admin/challenge-management",
  },

  {
    name: "Reports",
    icon: <AlertCircle className="w-5 h-5" />,
    to: "/admin/reports",
  },
];

const AdminLayout = () => {
  return (
    <>
      <Navbar isAuthenticated={true} isAdmin={true} />
      <SideBar navItems={navItems} role="admin" />
      <div className="bg-white dark:bg-black w-screen px-7 md:px-10 mt-18 md:ps-30 ">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
