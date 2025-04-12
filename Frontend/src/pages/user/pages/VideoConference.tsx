import ControlPanel from "@/components/user/room/ControlPanel";
import ParticipantsList from "@/components/user/room/ParticipantsList";
import { useSocket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WebRTCManager } from "@/lib/webRTCManager";
import VideoArea from "@/components/user/room/VideoArea";
import { toast } from "sonner";
import ReportModal from "@/components/modal/ReportModal";
export interface PeerData {
  peerId: string;
  peer: RTCPeerConnection;
}
type ParticipantType = {
  name: string;
  avatar: string;
  isMuted: boolean;
  socketId: string;
  isVideoOn: boolean;
  isHandRised: boolean;
};
export default function VideoConference() {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [participants, setParticipants] = useState<
    Map<string, ParticipantType>
  >(new Map());
  const { roomId } = useParams<{ roomId: string }>();
  const socket = useSocket();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<{
    [key: string]: MediaStream;
  }>({});
  const [webrtcManager, setWebRTCManager] = useState<WebRTCManager | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    const manager = new WebRTCManager(socket, (peerId, stream) => {
      if (!stream) {
        setRemoteStreams((prev) => {
          const updatedStream = { ...prev };
          delete updatedStream[peerId];
          return updatedStream;
        });
        return;
      }
      setRemoteStreams((prev) => ({
        ...prev,
        [peerId]: stream,
      }));
    });
    setWebRTCManager(manager);
    const role = localStorage.getItem("room-isHost");
    setIsHost(role == "host");
    manager.initializeLocalStream().then((stream) => {
      if (localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream;
      }
      //
      socket.emit("join-room", roomId);
      
      socket.on("participants", (data) => {
        const participantsMap = new Map<string, ParticipantType>();
        data.forEach((user: ParticipantType) => {
          participantsMap.set(user.socketId, user);
        });
        setParticipants(participantsMap);
      });

      socket.on("room-message", (message) => {
        toast.dismiss();
        toast.success(message);
      });

      socket.on("terminate-user", (data) => {
        toast.error(data.message);
        socket.emit("leave-room", roomId);
        socket.disconnect();
        navigate(-1);
      });
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.off("room-message");
      socket.off("terminate-user");
      socket.off("participants");
      localStorage.removeItem("room-isHost");
      manager.cleanup();
      socket.disconnect(); // Also disconnecting while ending the call.
    };
  }, [roomId]);

  const handleToggleMute = () => {
    if (webrtcManager) {
      setIsMuted(!isMuted);
      webrtcManager.toggleAudio(!isMuted);
    }
  };
  const handleToggleVideo = () => {
    if (webrtcManager) {
      setIsVideoOn(!isVideoOn);
      webrtcManager.toggleVideo(!isVideoOn);
    }
  };

  const handleToggleHand = () => {
    setIsHandRaised((prev) => {
      const updatedVal = !prev;
      socket.emit("hand-rise", { roomId, isHandRised: updatedVal });
      return updatedVal;
    });
  };

  const handleToggleChat = () => setIsChatOpen(!isChatOpen);
  const handleEndCall = () => {
    socket.emit("leave-room", roomId);
    navigate("/user/room");
    socket.disconnect();
  };

  return (
    <main className="flex-1 flex flex-col p-4 mb-50bg-orange-300  relative mb-20 md:mb-50 dark:bg-black h-screen">
      <div className=" w-full flex justify-between items-center my-2 md:my-4 ">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <span className="text-gray-500 dark:text-gray-400">Room ID:</span>
          <span className="text-primary-500 dark:text-primary-500">
            {roomId}
          </span>
        </div>
        {!isHost && <ReportModal entityId={roomId!} type="room" />}
      </div>
      <div className="flex flex-1 gap-4 ">
        <div className="flex-1">
          <VideoArea
            localVideoRef={localVideoRef}
            remoteStreams={remoteStreams}
            participants={participants}
          />
        </div>
        <ParticipantsList
          participants={Array.from(participants.values())}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          roomId={roomId || ""}
          isHost={isHost}
        />
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
