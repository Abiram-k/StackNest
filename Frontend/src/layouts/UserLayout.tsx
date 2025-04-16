import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import { useGetUnreadMessagesCount } from "@/hooks/user/connection/message/useGetUnreadMessageCount";
import { useGetNotification } from "@/hooks/user/connection/useGetNotification";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const { data: notificationData } = useGetNotification();
  const notificationLength = notificationData?.notifications.length;
  const { data: unReadMessageCountData } = useGetUnreadMessagesCount();
  const unReadMessageCount = unReadMessageCountData?.count;
  return (
    <>
      <Navbar
        unReadMessageCount={unReadMessageCount || 0}
        isAuthenticated={true}
        isAdmin={false}
        notificationLength={notificationLength || 0}
      />
      <div className="mt-25 h-fit ms-8">
        <Breadcrumbs />
      </div>
      <ScrollToTop />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
