import { Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Participant {
  id: string;
  name: string;
  isVideoOn: boolean;
}

interface VideoAreaProps {
  peers: Participant[];
  localUser: Participant;
}



export default function VideoArea({ peers, localUser }: VideoAreaProps) {
  return (
    <div className="relative w-full h-full">
      <div
        className={`grid gap-2 w-full h-full ${getGridColumns(peers.length)}`}
      >
        {peers.map((peer) => (
          <PeerVideo key={peer.id} participant={peer} />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] z-10">
        <Card className="overflow-hidden shadow-lg rounded-lg border-2 border-primary">
          <CardContent className="p-0">
            {localUser.isVideoOn ? (
              <div className="relative">
                <video
                  className="w-full aspect-video object-cover"
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

function PeerVideo({ participant }: { participant: Participant }) {
  return (
    <Card className="w-full h-full overflow-hidden shadow-md rounded-lg dark:bg-black">
      <CardContent className="p-0 h-full relative">
        {participant.isVideoOn ? (
          <div className="w-full h-full bg-gray-400 relative dark:bg-gray-600">
            <video
              src="/placeholder.svg?height=400&width=600"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 flex items-center">
              <Pin className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm font-medium bg-black/50 text-white px-2 py-1 rounded">
                {participant.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">👤</div>
              <p>{participant.name}</p>
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
