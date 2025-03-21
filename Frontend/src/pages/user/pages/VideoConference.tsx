import ControlPanel from "@/components/user/ControlPanel";
import ParticipantsList from "@/components/user/ParticipantsList";
import VideoArea from "@/components/user/VideoArea";
import { useSocket } from "@/lib/socket";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

type participantsType = {
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
}[];

export default function VideoConference() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [participants, setParticipants] = useState<participantsType>([
    {
      name: "No name",
      avatar: "",
      isMuted: false,
      isVideoOn: false,
    },
  ]);
  const { roomId } = useParams<{ roomId: string }>();
  const socket = useSocket();

  useEffect(() => {
    socket.on("participants", (data) => {
      setParticipants(data);
    });
    socket.emit("join-room", roomId);

    socket.on("room-message", (message) => {
      toast.success(message);
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.off("join-room");
      socket.off("room-message");
      socket.off("participants");
    };
  }, [roomId]);

  const handleToggleMute = () => setIsMuted(!isMuted);
  const handleToggleVideo = () => setIsVideoOn(!isVideoOn);
  const handleToggleHand = () => setIsHandRaised(!isHandRaised);
  const handleToggleChat = () => setIsChatOpen(!isChatOpen);
  const handleEndCall = () => alert("Call ended");

  return (
    <main className="flex-1 flex flex-col p-4 mb-50bg-orange-300  relative mb-20 md:mb-50 dark:bg-black h-fit">
      <div className="text-sm text-gray-600 mb-2 dark:text-white">
        ROOM ID: {roomId}
      </div>
      <div className="flex flex-1 gap-4">
        <div className="flex-1">
          <VideoArea hostName="Abiram k" isVideoOn={isVideoOn} />
        </div>
        <ParticipantsList participants={participants} />
      </div>
      <ControlPanel
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        isHandRaised={isHandRaised}
        isChatOpen={isChatOpen}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onToggleHand={handleToggleHand}
        onToggleChat={handleToggleChat}
        onEndCall={handleEndCall}
      />
    </main>
  );
}
