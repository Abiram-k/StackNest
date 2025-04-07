import {
  ChevronRight,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/lib/socket";

interface Participant {
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRised: boolean;
  socketId: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean) => void;
  roomId: string;
  isHost: boolean;
}

interface Participant {
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRised: boolean;
}

interface ParticipantCardProps {
  participant: Participant;
  handleRemoveFromRoom: (socketId: string) => void;
  isHost: boolean;
}

interface MessageType {
  avatar?: any;
  sender: string;
  message: string;
  timestamp: Date;
}

export default function ParticipantsList({
  participants,
  isChatOpen,
  setIsChatOpen,
  roomId,
  isHost,
}: ParticipantsListProps) {
  const [isParticipantsVisible, setIsParticipantVisible] = useState(false);
  const socket = useSocket();

  const [messages, setMessages] = useState<MessageType[]>();
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const sendMessageData = {
      message: newMessage.slice(0, 20),
      timestamp: new Date(),
      roomId,
    };
    socket.emit("send-message", sendMessageData);
    setMessages((prev = []) => [
      ...prev,
      {
        sender: "host",
        message: sendMessageData.message,
        timestamp: sendMessageData.timestamp,
      },
    ]);
    setNewMessage("");
  };

  const handleRemoveFromRoom = (socketId: string) => {
    socket.emit("room-removeUser", socketId, roomId);
  };

  useEffect(() => {
    socket.on("message-recieved", (recievedData: MessageType) => {
      setMessages((prev = []) => [...prev, recievedData]);
      scrollToBottom();
    });
    return () => {
      socket.off("message-recieved");
    };
  }, [roomId]);

  return (
    <>
      <button
        onClick={() => setIsParticipantVisible(!isParticipantsVisible)}
        className=" fixed bottom-12 md:bottom-4 right-4 md:z-50   p-3 md:p-5 bg-purple-500 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
      >
        {isParticipantsVisible ? (
          <ChevronRight className="w-5 h-5 text-white" />
        ) : (
          <Users className="w-5 h-5 text-white" />
        )}
      </button>

      <Card
        className={` w-fit ms-2 p-4 mt-35 bg-white z-90 dark:bg-black h-3/4  rounded-lg shadow-sm border border-gray-100 dark:border-gray-800
        fixed  inset-0  transition-transform duration-300 ${
          isParticipantsVisible ? "translate-x-0" : "-translate-x-full "
        }`}
      >
        <CardHeader className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-500" />
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                Participants ({participants.length})
              </CardTitle>
            </div>
            <X
              className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setIsParticipantVisible(false)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-3 h-[calc(100%-56px)] overflow-y-auto">
          <div className="space-y-2">
            {participants.map((participant, index) => (
              <ParticipantCard
                key={index}
                participant={participant}
                isHost={isHost}
                handleRemoveFromRoom={handleRemoveFromRoom}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`lg:w-80 w-full  mt-25 md:mt-0 bg-white z-30 dark:bg-black h-[70vh] border-gray-200
           rounded-lg shadow-sm border-2  dark:border-gray-800
        fixed lg:static inset-0 lg:translate-x-0 transition-transform duration-300 ${
          isChatOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <CardHeader className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                Messages
              </CardTitle>
            </div>
            <X
              className="lg:hidden w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setIsChatOpen(false)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-1 h-full flex flex-col ">
          <div className="flex-grow overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin">
            {messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "host" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] lg:max-w-[70%] rounded-lg p-3 ${
                    msg.sender === "host"
                      ? "bg-blue-500 text-white ml-8"
                      : "bg-gray-100 dark:bg-gray-800 mr-8"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2 w-fit px-1">
                    {msg.sender !== "host" && (
                      <img
                        src={msg.avatar || "/placeholder.svg"}
                        alt="user"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {msg.sender === "host" ? "You" : msg.sender}
                    </span>
                  </div>

                  <p className="text-sm break-words whitespace-pre-wrap">
                    {msg.message}
                  </p>

                  <p
                    className={`text-xs mt-2 ${
                      msg.sender === "host"
                        ? "text-blue-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="sticky bottom-1 bg-white dark:bg-black pt-2">
            <div className="flex items-center gap-2 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-grow p-3 pr-12 border rounded-full bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="absolute right-2 p-2 bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ParticipantCard({
  participant,
  isHost,
  handleRemoveFromRoom,
}: ParticipantCardProps) {
  return (
    <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border border-gray-100 dark:border-gray-800">
      <div className="flex items-center space-x-3">
        <div className="relative h-10 w-10">
          <img
            src={participant.avatar || "/placeholder.svg"}
            alt={participant.name}
            className="rounded-full h-full w-full object-cover border-2 border-purple-100 dark:border-gray-700"
          />
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
        </div>
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
            {participant.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
        </div>
      </div>

      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 rounded-full hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </Button>
        {isHost && (
          <Button
            onClick={() => handleRemoveFromRoom(participant.socketId)}
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-full text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
