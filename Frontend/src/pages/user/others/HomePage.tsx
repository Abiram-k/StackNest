import { useAxiosWithAuth } from "@/api/api";
import BannerSection from "@/components/BannerSection";
import CreateRoomSection from "@/components/CreateRoomSection";
import FreindsSection from "@/components/FreindsSection";
import HeroSection from "@/components/HeroSection";
import PremiumSection from "@/components/PremiumSection";
import RoomSection from "@/components/RoomSection";

const HomePage = () => {

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-16">
        <HeroSection />
        <CreateRoomSection />
        <RoomSection />
        <BannerSection />
        <FreindsSection />
        <PremiumSection />
      </main>
    </div>
  );
};

export default HomePage;
