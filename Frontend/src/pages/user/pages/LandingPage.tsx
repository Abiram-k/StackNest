import MyAccordion from "@/components/Accordion";
import CreateRoomSection from "@/components/user/CreateRoomSection";
import Footer from "@/components/user/Footer";
import HeroSection from "@/components/user/HeroSection";
import Navbar from "@/components/user/Navbar";
import PremiumSection from "@/components/user/PremiumSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar isAuthenticated={false} isAdmin={false} notificationLength={0} />
      <main className="pt-16">
        <HeroSection />
        <CreateRoomSection />
        <MyAccordion />
        <PremiumSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
