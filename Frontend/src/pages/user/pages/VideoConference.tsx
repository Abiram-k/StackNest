import ControlPanel from "@/components/user/ControlPanel";
import ParticipantsList from "@/components/user/ParticipantsList";
import { useSocket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { WebRTCManager } from "@/lib/webRTCManager";
import { Card, CardContent } from "@/components/ui/card";
import { Pin } from "lucide-react";

export interface PeerData {
  peerId: string;
  peer: RTCPeerConnection;
}

type participantsType = {
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRised: boolean;
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
      isHandRised: false,
    },
  ]);

  const { roomId } = useParams<{ roomId: string }>();
  const socket = useSocket();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<{
    [key: string]: MediaStream;
  }>({});
  const [webrtcManager, setWebrtcManager] = useState<WebRTCManager>();

  useEffect(() => {
    const manager = new WebRTCManager(socket, (peerId, stream) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [peerId]: stream,
      }));
    });

    manager.initializeLocalStream().then((stream) => {
      if (localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream;
      }
      socket.emit("join-room", roomId);
    });

    setWebrtcManager(manager);
    return () => {
      manager.cleanup();
      socket.disconnect();
    };
  }, [roomId]);

  // useEffect(() => {
  //   socket.on("participants", (data) => {
  //     setParticipants(data);
  //   });

  //   socket.on("room-message", (message) => {
  //     toast.dismiss();
  //     toast.success(message);
  //   });

  //   return () => {
  //     socket.emit("leave-room", roomId);
  //     socket.off("room-message");
  //     socket.off("participants");
  //   };
  // }, [roomId]);

  const handleToggleMute = () => setIsMuted(!isMuted);
  const handleToggleVideo = () => setIsVideoOn(!isVideoOn);

  const handleToggleHand = () => {
    setIsHandRaised((prev) => {
      const updatedVal = !prev;
      socket.emit("hand-rise", { roomId, isHandRised: updatedVal });
      return updatedVal;
    });
  };

  const handleToggleChat = () => setIsChatOpen(!isChatOpen);
  const handleEndCall = () => alert("Call ended");

  return (
    <main className="flex-1 flex flex-col p-4 mb-50bg-orange-300  relative mb-20 md:mb-50 dark:bg-black h-fit">
      <div className="text-sm text-gray-600 mb-2 dark:text-white">
        ROOM ID: {roomId}
      </div>
      <div className="flex flex-1 gap-4">
        <div className="flex-1">
          <div className="relative w-full h-full">
            <div
              className={`grid gap-2 w-full h-full ${getGridColumns(
                Object.entries(remoteStreams).length
              )}`}
            >
              {Object.entries(remoteStreams).map(([peerId, stream]) => (
                <PeerVideo key={peerId} stream={stream} peerId={peerId} />
              ))}
            </div>

            <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] z-10">
              <Card className="overflow-hidden shadow-lg rounded-lg border-2 border-primary">
                <CardContent className="p-0">
                  {true ? (
                    <div className="relative">
                      <video
                        ref={localVideoRef}
                        className="w-full aspect-video object-cover"
                        muted
                        autoPlay
                      />
                      <div className="absolute bottom-2 left-2 flex items-center">
                        <span className="text-xs font-medium bg-black/50 text-white px-2 py-0.5 rounded">
                          You
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center bg-gray-800">
                      <div className="text-white text-center">
                        <div className="text-2xl mb-1">👤</div>
                        <p className="text-xs">You (camera off)</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
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

function PeerVideo({
  peerId,
  stream,
}: {
  peerId: string;
  stream: MediaStream;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Card className="w-full h-full overflow-hidden shadow-md rounded-lg dark:bg-black">
      <CardContent className="p-0 h-full relative">
        {true ? (
          <div className="w-full h-full bg-gray-400 relative dark:bg-gray-600">
            <video
              ref={videoRef}
              autoPlay
              src="/placeholder.svg?height=400&width=600"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 flex items-center">
              <Pin className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm font-medium bg-black/50 text-white px-2 py-1 rounded">
                {peerId}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">👤</div>
              <p>{peerId}</p>
              <p className="text-sm text-gray-400">Camera is off</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getGridColumns(peerCount: number): string {
  if (peerCount <= 1) return "grid-cols-1";
  if (peerCount <= 2) return "grid-cols-1 md:grid-cols-2";
  if (peerCount <= 4) return "grid-cols-2";
  if (peerCount <= 6) return "grid-cols-2 md:grid-cols-3";
  if (peerCount <= 9) return "grid-cols-3";
  return "grid-cols-3 md:grid-cols-4";
}
