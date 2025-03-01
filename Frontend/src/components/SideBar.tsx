import { Button } from "./ui/button";
import {
  BarChart2,
  Crown,
  FileText,
  Home,
  Layout,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="z-50" >
      <button
        className={`fixed  top-30  left-4 p-2 rounded-lg z-50 shadow-sm ${
          isOpen ? "sm:left-30 md:left-50" : "left-4"
        } transition-all duration-300`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6 cursor-pointer" /> : <Menu className="h-6 w-6 cursor-pointer" />}
      </button>

      {isOpen && (
        <aside className="fixed left-0 top-20 w-64 h-[calc(100vh-5rem)] border-r bg-white ">
          <nav className="p-4 space-y-2 flex justify-center align-middle flex-col h-3/4">
            <NavLink
              to="/user/profile"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Home className="h-5 w-5" />
              Profile
            </NavLink>

            <NavLink
              to="/stats"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <BarChart2 className="h-5 w-5" />
              Stats
            </NavLink>

            <NavLink
              to="/posts"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <FileText className="h-5 w-5" />
              Posts
            </NavLink>

            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Layout className="h-5 w-5" />
              Rooms
            </NavLink>

            <NavLink
              to="/friends"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Users className="h-5 w-5" />
              Friends
            </NavLink>

            <NavLink
              to="/premium"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Crown className="h-5 w-5" />
              Premium
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Settings className="h-5 w-5" />
              Settings
            </NavLink>
          </nav>

          <div className="absolute bottom-0 w-full p-4">
            <Button variant="destructive" className="w-full">
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default SideBar;
