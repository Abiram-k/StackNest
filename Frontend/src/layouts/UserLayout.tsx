import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar isAuthintacted={true} isAdmin={false} />
      <div className="mt-25 h-fit ms-8">
        <Breadcrumbs />
      </div>
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
