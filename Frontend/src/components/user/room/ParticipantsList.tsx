import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Phone,
  Plus,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import ParticipantCard from "./ParticipantCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
}

// export default function ParticipantsList({
//   participants,
// }: ParticipantsListProps) {
//   return (
//     <Card className="w-80 bg-purple-100 dark:bg-black h-96 rounded-lg shadow-md">
//       <CardHeader className="p-4 bg-primary-500 dark:bg-primary-600 text-white rounded-t-lg">
//         <div className="flex items-center">
//           <UserPlus className="w-5 h-5 mr-2" />
//           <CardTitle className="text-lg font-medium">Participants</CardTitle>
//         </div>
//       </CardHeader>
//       <CardContent className="dark:bg-black p-2 max-h-[calc(100vh-250px)] overflow-y-auto">
//         {participants.map((participant, index) => (
//           <ParticipantCard key={index} participant={participant} />
//         ))}
//       </CardContent>
//     </Card>
//   );
// }

export default function ParticipantsList({
  participants,
}: ParticipantsListProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-purple-500 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
      >
        {isVisible ? (
          <ChevronLeft className="w-6 h-6 text-white" />
        ) : (
          <ChevronRight className="w-6 h-6 text-white" />
        )}
      </button>

      <Card
        className={`lg:w-80 w-full bg-white dark:bg-black h-[calc(100vh-150px)] lg:h-[calc(100vh-100px)] rounded-lg shadow-sm border border-gray-100 dark:border-gray-800
        fixed lg:static inset-0 lg:translate-x-0 transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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
              className="lg:hidden w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setIsVisible(false)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-3 h-[calc(100%-56px)] overflow-y-auto">
          <div className="space-y-2">
            {participants.map((participant, index) => (
              <ParticipantCard key={index} participant={participant} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ParticipantCard({ participant }: ParticipantCardProps) {
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

        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 rounded-full text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
