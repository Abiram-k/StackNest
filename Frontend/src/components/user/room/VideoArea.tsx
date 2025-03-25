import { Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MutableRefObject, useEffect, useRef } from "react";

type ParticipantType = {
  name: string;
  avatar: string;
  isMuted: boolean;
  socketId: string;
  isVideoOn: boolean;
  isHandRised: boolean;
};

interface VideoAreaProps {
  remoteStreams: {
    [key: string]: MediaStream;
  };
  localVideoRef: MutableRefObject<HTMLVideoElement | null>;

  participants: Map<string, ParticipantType>;
}

export default function VideoArea({
  remoteStreams,
  localVideoRef,
  participants,
}: VideoAreaProps) {
  return (
    <div className="relative w-full h-3/4">
      <div
        className={`grid gap-2 w-full h-full ${getGridColumns(
          Object.entries(remoteStreams).length
        )}`}
      >
        {Object.keys(remoteStreams).length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">📡</div>
              <p>No participants connected</p>
              <p className="text-sm text-gray-400">
                Waiting for others to join the room...
              </p>
            </div>
          </div>
        ) : (
          Object.entries(remoteStreams).map(([peerId, stream]) => (
            <PeerVideo
              key={`${peerId}`}
              stream={stream}
              userName={participants.get(peerId)?.name || "No Name"}
              avatar={
                participants.get(peerId)?.avatar ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
            />
          ))
        )}
      </div>

      <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] z-10">
        <Card className="overflow-hidden shadow-lg rounded-lg border-2 border-primary-500/60 bg-gray-400 dark:bg-gray-600 h-fit">
          <CardContent className="p-0">
            {localVideoRef ? (
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
  );
}

function PeerVideo({
  userName,
  stream,
  avatar,
}: {
  userName: string;
  stream: MediaStream;
  avatar: string;
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
        {stream ? (
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
                {userName}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-white text-center">
              <div className="text-4xl mb-2 w-full h-full flex justify-center items-center">
                <img src={avatar} alt="user" className="rounded w-10 h-10" />
              </div>
              <p>{userName}</p>
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
