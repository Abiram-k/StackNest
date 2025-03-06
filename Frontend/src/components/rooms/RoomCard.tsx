import { Edit, Trash2, Trophy } from "lucide-react";
import { Button } from "../ui/button";
import AvatarGroup from "../avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface Room {
  roomId: string;
  title: string;
  description: string;
  participants: { name: string; avatar: string }[];
  isPremium?: string;
  limit: number;
}

interface RoomCardProps {
  room: Room;
  type: "my-room" | "available";
}

const RoomCard = ({ room, type }: RoomCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{room.title}</h3>
          <p className="text-sm text-gray-500">ID: {room.roomId}</p>
        </div>
        <div className="flex gap-2">
          {type === "my-room" ? (
            <>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            room.isPremium == "Yes" && (
              <Trophy className="h-5 w-5 text-yellow-500" />
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Description:</span>
          <p className="text-sm line-clamp-2">{room.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <Button
            className={
              // type === "my-room"
              // ?
              "bg-primary-600 dark:bg-primary-600 hover:bg-primary-500/90"
              // : "bg-purple-600 hover:bg-purple-700"
            }
          >
            {type === "my-room" ? "Enter" : "Join"}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {room.participants.length}/{room.limit}
            </span>
            <AvatarGroup>
              {room.participants.map((participant, i) => (
                <Avatar key={i}>
                  <AvatarImage
                    src={participant.avatar}
                    alt={participant.name}
                  />
                  <AvatarFallback>{participant.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
