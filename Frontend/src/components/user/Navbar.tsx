import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Heart,
  Search,
  User,
  Menu,
  X,
  Flame,
  Send,
} from "lucide-react";
import Logo from "../ui/Logo";
import { CustomNavLink } from "../ui/customNavLink";
import { useGetStreakCount } from "@/hooks/user/userProfile/useGetStreakCount";
import { useTranslation } from "react-i18next";

const Navbar = ({
  isAuthenticated,
  isAdmin,
  notificationLength,
  unReadMessageCount,
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
  notificationLength: number;
  unReadMessageCount: number;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  // const [unReadMessageCount, setUnReadMessageCount] = useState(0);
  const { t } = useTranslation();

  const { data } = useGetStreakCount({ isAdmin, isAuthenticated });

  useEffect(() => {
    if (!isAdmin && isAuthenticated && data?.streakCount) {
      setStreak(data.streakCount);
    }
  }, [data?.streakCount]);

  return (
    <nav className="fixed top-0 w-full bg-background z-50 border-b shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          <Logo isAdmin={isAdmin} />

          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-6">
              {!isAdmin ? (
                <>
                  <CustomNavLink to="/user/home" end>
                    {t("Home")}
                  </CustomNavLink>
                  <CustomNavLink to="/user/room" end>
                    {t("Rooms")}
                  </CustomNavLink>
                  <CustomNavLink to="/user/challenge" end>
                    {t("Challenge")}
                  </CustomNavLink>
                  <CustomNavLink to="/user/highlights" end>
                    {t("Highlights")}
                  </CustomNavLink>
                  <CustomNavLink to="/user/about" end>
                    {t("About")}
                  </CustomNavLink>
                  <CustomNavLink to="/user/contact" end>
                    {t("Contact")}
                  </CustomNavLink>
                </>
              ) : (
                <h1 className="text-xl uppercase font-bold text-gray-900 dark:text-white text-center mt-4">
                  {/* Admin Portal */}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/auth/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className=" bg-primary-500 hover:bg-primary-500/90 hover:text-white text-white dark:bg-primary-600 hidden sm:flex px-10 py-2  cursor-pointer"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button
                    variant="ghost"
                    size="icon"
                    className=" bg-primary-500 hover:bg-primary-500/90 hover:text-white text-white dark:bg-primary-600 hidden sm:flex px-10 py-2 cursor-pointer"
                  >
                    Register
                  </Button>
                </Link>
                <Link to="/auth/login" className="sm:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-primary-500 text-white  cursor-pointer dark:bg-primary-600"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <>
                  {isAdmin ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-muted"
                    >
                      <Search className="h-7 w-7" />
                    </Button>
                  ) : (
                    <>
                      <Link to={"/user/profile"}>
                        <button className="gap-1.5 flex justify-center items-center p-2 group hover:bg-transparent">
                          <Flame className=" h-6 w-6 text-orange-500 transition-all duration-300 group-hover:scale-110 group-hover:text-orange-400 group-hover:animate-pulse" />
                          <span className="text-orange-500 font-medium text-sm ">
                            {streak}
                          </span>
                        </button>
                      </Link>

                      <Link to={"/user/favorites"}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-muted"
                        >
                          <Heart className="h-7 w-7" />
                        </Button>
                      </Link>
                      <Link to={"/user/profile"}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative hover:bg-muted"
                        >
                          {notificationLength > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                              {notificationLength}
                            </span>
                          )}
                          <User className="h-7 w-7" />
                        </Button>
                      </Link>
                      <Link to={"/user/messaging"}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative hover:bg-muted"
                        >
                          {unReadMessageCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                              {unReadMessageCount}
                            </span>
                          )}
                          <Send className="h-6 w-6 text-primary" />
                        </Button>
                      </Link>
                    </>
                  )}
                </>
                {/* )} */}
                {!isAdmin && (
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded-md 
                cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Toggle navigation menu"
                  >
                    {isOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="flex flex-col items-center gap-4 py-4">
            <Link
              to="/user/home"
              className="text-md font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/user/room"
              className="text-md font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Room
            </Link>
            <Link
              to="/user/challenge"
              className="text-md font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Daily Challenge
            </Link>
            <Link
              to="/user/highlights"
              className="text-md font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Highlights
            </Link>
            <Link
              to="/user/contact"
              className="text-md font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
