import MyAccordion from "@/components/Accordion";
import BannerSection from "@/components/user/BannerSection";
import CreateRoomSection from "@/components/user/CreateRoomSection";
import Footer from "@/components/user/Footer";
import FreindsSection from "@/components/user/FreindsSection";
import HeroSection from "@/components/user/HeroSection";
import Navbar from "@/components/user/Navbar";
import PremiumSection from "@/components/user/PremiumSection";
import RoomSection from "@/components/user/RoomSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar isAuthintacted={false} />
      <main className="pt-16">
        <HeroSection />
        <CreateRoomSection />
        <RoomSection />
        <BannerSection />
        <FreindsSection />
        <MyAccordion/>

        <PremiumSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
