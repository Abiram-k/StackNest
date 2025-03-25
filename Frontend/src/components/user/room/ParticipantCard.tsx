import { useState } from "react";
import { Mic, MicOff, Video, VideoOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Participant {
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRised: boolean;
}

interface ParticipantCardProps {
  participant: Participant;
}

export default function ParticipantCard({ participant }: ParticipantCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="mb-2 overflow-hidden bg-white dark:bg-black transition-all duration-200 hover:shadow-lg border-0 dark:text-white rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-purple-100 mr-3 text-center">
            <img
              src={participant.avatar || "/placeholder.svg"}
              alt={participant.name}
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out"
              style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
            />
          </div>
          <div className="w-full">
            <p className="font-medium text-sm">{participant.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-full hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-full text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
