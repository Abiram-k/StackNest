import  MyAccordion  from "@/components/Accordion";
import BannerSection from "@/components/user/BannerSection";
import CreateRoomSection from "@/components/user/CreateRoomSection";
import FreindsSection from "@/components/user/FreindsSection";
import HeroSection from "@/components/user/HeroSection";
import PremiumSection from "@/components/user/PremiumSection";
import RoomSection from "@/components/user/RoomSection";

const HomePage = () => {

  return (
    <div className="min-h-screen bg-white  ">
      <main className="pt-16">
        <HeroSection />
        <CreateRoomSection />
        <RoomSection />
        <BannerSection />
        <FreindsSection />
        <MyAccordion/>
        <PremiumSection />
      </main>
    </div>
  );
};

export default HomePage;
