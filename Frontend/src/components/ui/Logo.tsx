import { GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/stacknest-logo.png";

const Logo = ({
  isAdmin,
  isAuthenticated,
}: {
  isAdmin?: boolean;
  isAuthenticated?: boolean;
}) => {
  return (
    <div className="flex justify-center gap-2 md:justify-start">
      <Link
        to={isAdmin ? "/admin/dashboard/" : "/user/home"}
        className="flex items-center gap-2 font-medium"
      >
        <div className="flex h-8 w-8 md:w-6 md:h-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
          <img src={logo} alt="stack nest logo icon" loading="lazy" />
        </div>

        {isAuthenticated ? (
          <span className="hidden md:block">Stack Nest</span>
        ) : (
          <span>Stack Nest</span>
        )}
      </Link>
    </div>
  );
};

export default Logo;
