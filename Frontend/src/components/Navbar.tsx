import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart, Search, User, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slice/userSlice";
import { CustomNavLink } from "./ui/customNavLink";

const Navbar = ({ isAuthintacted }: { isAuthintacted: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  return (
    <nav className="fixed top-0 w-full bg-background z-50 border-b shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-6">
              <CustomNavLink to="/user/home" end>
                Home
              </CustomNavLink>
              <CustomNavLink to="/user/about" end>
                About
              </CustomNavLink>
              <CustomNavLink to="/user/challenge" end>
                Challenge
              </CustomNavLink>
              <CustomNavLink to="/user/highlights" end>
                Highlights
              </CustomNavLink>
              <CustomNavLink to="/user/contact" end>
                Contact
              </CustomNavLink>
              <Button
                onClick={() => dispatch(logout())}
                variant="ghost"
                className="bg-red-500 hover:bg-red-500/90 hover:text-white text-white dark:bg-red-600 hidden sm:flex px-10 py-2 transition-colors duration-300"
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthintacted ? (
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
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <Search className="h-7 w-7" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <Heart className="h-7 w-7" />
                </Button>
                <Link to={"/user/profile"}>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <User className="h-7 w-7" />
                </Button>
                </Link>

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
              to="/"
              className="text-md font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-md font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/challenge"
              className="text-md font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Daily Challenge
            </Link>
            <Link
              to="/highlights"
              className="text-md font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Highlights
            </Link>
            <Link
              to="/contact"
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
