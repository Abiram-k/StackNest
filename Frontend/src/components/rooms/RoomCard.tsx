import { Edit, Lock, Trash2, Trophy } from "lucide-react";
import { Button } from "../ui/button";

interface Room {
  _id: string;
  roomId: string;
  title: string;
  description: string;
  participants: {
    user: { userName: string; avatar: string };
    joinedAt: Date;
    leavedAt: Date;
  }[];
  isPremium?: string;
  limit: number;
  isPrivate?: string;
  isBlocked: boolean;
}

interface RoomCardProps {
  room: Room;
  type: "my-room" | "available";
  onEdit?: (value: string) => void;
  onRemove?: (value: string) => void;
  handleEnterRoom?: (type: string, isPrivate: string, roomId: string) => void;
}

const RoomCard = ({
  room,
  type,
  onEdit,
  onRemove,
  handleEnterRoom,
}: RoomCardProps) => {
  return (
    <div className="bg-white rounded-lg dark:bg-gray-900 shadow-md p-6 space-y-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">ID: {room.roomId}</p>
          <h3 className="text-lg font-semibold">{room.title}</h3>
        </div>
        <div className="flex gap-2">
          {type === "my-room" && onEdit && onRemove ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(room._id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500"
                onClick={() => onRemove(room.roomId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex justify-center align-middle items-center gap-1">
              {room.isPrivate == "Yes" && (
                <Lock className=" h-4 w-4 text-gray-600" />
              )}
              {room.isPremium == "Yes" && (
                <Trophy className="h-5 w-5 text-yellow-500" />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex  gap-1 flex-col">
          <span className="text-xs text-gray-500">Description:</span>
          <p className="text-sm line-clamp-2">{room.description}</p>
        </div>

        <div className="flex items-center justify-between">
          {room.isBlocked ? (
            <p className="text-orange-400">Room is temporarily unavailable</p>
          ) : (
            <Button
              className={
                "bg-primary-600 hover:bg-primary-500/90 dark:hover:bg-primary-500/90 dark:bg-primary-600 dark:text-gray-300"
              }
              onClick={() => {
                handleEnterRoom &&
                  handleEnterRoom(type, room.isPrivate || "", room.roomId);
              }}
            >
              {type === "my-room" ? "Enter" : "Join"}
            </Button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {room.participants.length}/{room.limit}
            </span>
            <div className="flex -space-x-3">
              {room.participants?.slice(0, 5).map((participant, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full overflow-hidden border-2 border-white"
                >
                  <img
                    src={participant.user.avatar}
                    alt={participant.user.userName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
