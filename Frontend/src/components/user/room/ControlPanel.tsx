"use client";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ControlPanelProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isChatOpen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleHand: () => void;
  onToggleChat: () => void;
  onEndCall: () => void;
}

export default function ControlPanel({
  isMuted,
  isVideoOn,
  isHandRaised,
  isChatOpen,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
  onToggleChat,
  onEndCall,
}: ControlPanelProps) {
  return (
    <Card className="p-4 shadow-lg  rounded-lg dark:bg-gray-800 md:-mt-32 -mt-14">
      <div className="flex  justify-center items-center space-x-4  w-full p-5">
        <Button
          onClick={onToggleMute}
          variant="outline"
          size="icon"
          className={`rounded-full w-12 h-12 ${
            isMuted ? "bg-gray-200" : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {isMuted ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>

        <Button
          onClick={onToggleVideo}
          variant="outline"
          size="icon"
          className={`rounded-full w-12 h-12 ${
            isVideoOn
              ? "bg-gray-200"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {isVideoOn ? (
            <VideoOff className="h-5 w-5" /> 
          ) : (
            <Video className="h-5 w-5" />
          )}
        </Button>

        <Button
          onClick={onToggleHand}
          variant="outline"
          size="icon"
          className={`rounded-full w-12 h-12 ${
            isHandRaised
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-200"
          }`}
        >
          <Hand className="h-5 w-5" />
        </Button>

        <Button
          onClick={onToggleChat}
          variant="outline"
          size="icon"
          className={`rounded-full lg:hidden w-12 h-12 ${
            isChatOpen
              ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
              : "bg-gray-200"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-gray-200"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>

        <Button
          onClick={onEndCall}

          className="rounded-full px-6 py-2 bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 dark:text-white"
        >
          End Call
        </Button>

      </div>
    </Card>
  );
}
