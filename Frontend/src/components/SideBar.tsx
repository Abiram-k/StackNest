import { userLogout } from "@/redux/slice/userSlice";
import { Button } from "./ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { adminLogout } from "@/redux/slice/adminSlice";
import { useLogout } from "@/hooks/auth/useLogout";

type navItemType = {
  name: string;
  icon: React.ReactNode;
  to: string;
};
type sideBarPropsType = {
  role: string;
  navItems: navItemType[];
};

const SideBar = ({ role, navItems }: sideBarPropsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { mutate: logoutMutate } = useLogout();
  const handleLogout = () => {
    const currentRole = role == "user" ? "user" : "admin";
    logoutMutate(currentRole);
    if (role == "user") dispatch(userLogout());
    else dispatch(adminLogout());
    // window.location.reload();
  };
  return (
    <div className="z-50 ">
      <button
        className={`fixed  top-30  dark:bg-gray-800 left-4 p-2 rounded-lg z-50 shadow-sm cursor-pointer ${
          isOpen ? "sm:left-30 md:left-50" : "left-4"
        } transition-all duration-300`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6 " /> : <Menu className="h-6 w-6 " />}
      </button>

      {isOpen && (
        <aside className="fixed left-0 top-21 w-64 h-[calc(100vh-5.3rem)] border-r bg-white dark:bg-black  z-10 shadow-md transition-all duration-300">
          <nav className="p-4 space-y-2 flex justify-center align-middle flex-col h-full">
            {navItems.map((navItem, index) => (
              <NavLink
                to={navItem.to}
                key={index}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 transition-all duration-150   py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? "bg-purple-100 text-primary-600"
                      : "text-gray-600 dark:hover:text-primary-600  dark:text-gray-300 hover:text-primary-600 hover:bg-gray-100"
                  }`
                }
              >
                {navItem.icon}
                {navItem.name}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full p-4">
            <Button
              variant="default"
              className="w-full cursor-pointer hover:bg-red-600/90 bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-600/90"
              onClick={handleLogout}
            >
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
