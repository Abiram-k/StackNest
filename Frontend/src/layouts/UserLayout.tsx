import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar isAuthenticated={true} isAdmin={false} />
      <div className="mt-25 h-fit ms-8">
        <Breadcrumbs />
      </div>
      <ScrollToTop/>
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
