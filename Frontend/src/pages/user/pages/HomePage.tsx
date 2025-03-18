import MyAccordion from "@/components/Accordion";
import BannerSection from "@/components/user/BannerSection";
import CreateRoomSection from "@/components/user/CreateRoomSection";
import FreindsSection from "@/components/user/FreindsSection";
import HeroSection from "@/components/user/HeroSection";
import PremiumSection from "@/components/user/PremiumSection";
import RoomSection from "@/components/user/RoomSection";
// import { useSocket } from "@/lib/socket";
// import { useEffect } from "react";

const HomePage = () => {
  // const socket = useSocket();
  // useEffect(() => {
  //   socket.on("message", (data: string) => {
  //     alert(data);
  //   });

  //   return () => {
  //     socket.off("message");
  //   };
  // }, [socket]);

  // const sendMessage = () => {
  //   socket.emit("message", "message from frontend");
  // };

  return (
    <div className="min-h-screen bg-white dark:bg-black  ">
      {/* <button
        className="w-screen h-screen bg-primary-500 text-white"
        onClick={sendMessage}
      >
        Send Message
      </button> */}
      <main className="">
        <HeroSection />
        <CreateRoomSection />
        <RoomSection isAuthenticated />
        <BannerSection />
        <FreindsSection />
        <MyAccordion />
        <PremiumSection />
      </main>
    </div>
  );
};

export default HomePage;
