import BannerSection from "@/components/BannerSection";
import CreateRoomSection from "@/components/CreateRoomSection";
import Footer from "@/components/Footer";
import FreindsSection from "@/components/FreindsSection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import PremiumSection from "@/components/PremiumSection";
import RoomSection from "@/components/RoomSection";

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
        <PremiumSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
