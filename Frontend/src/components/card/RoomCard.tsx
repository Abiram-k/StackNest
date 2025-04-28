import {
  AlertCircle,
  ArrowRight,
  Edit,
  Heart,
  Lock,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";

interface Room {
  _id: string;
  roomId: string;
  title: string;
  description: string;
  participants: {
    user: { userName: string; avatar: string };
    totalDuration: number;
    lastJoined: Date;
  }[];
  isPremium?: string;
  limit: number;
  isPrivate?: string;
  isBlocked: boolean;
}

interface RoomCardProps {
  room: Room;
  type: "my-room" | "available" | "favorites";
  onEdit?: (value: string) => void;
  onRemove?: (value: string) => void;
  handleEnterRoom?: (type: string, isPrivate: string, roomId: string) => void;
  favorites?: Room[];
  handleRemoveFromFavorites?: (roomId: string) => void;
  handleAddToFavorites?: (roomId: string) => void;
}

const RoomCard = ({
  room,
  type,
  onEdit,
  onRemove,
  handleEnterRoom,
  favorites,
  handleAddToFavorites,
  handleRemoveFromFavorites,
}: RoomCardProps) => {
  const isFavorite = favorites?.some((fav) => fav.roomId === room.roomId);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg p-6 space-y-4 transition-transform duration-300 hover:scale-105 hover:shadow-xl ">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">ID: {room.roomId}</p>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {room.title}
          </h3>
        </div>
        <div className="flex gap-2">
          {type !== "available" ? (
            <>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(room._id)}
                >
                  <Edit className="h-5 w-5 text-gray-600 hover:text-primary-500" />
                </Button>
              )}
              {onRemove && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => onRemove(room._id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              {room.isPrivate === "Yes" && (
                <Lock className="h-5 w-5 text-gray-600" />
              )}
              {room.isPremium === "Yes" && (
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              )}
              {favorites && (
                <button
                  className="p-2 hover:scale-110 transition-all"
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                  onClick={() =>
                    isFavorite
                      ? handleRemoveFromFavorites?.(room._id)
                      : handleAddToFavorites?.(room._id)
                  }
                >
                  <Heart
                    className={`w-6 h-6 cursor-pointer ${
                      isFavorite
                        ? "text-transparent fill-red-600"
                        : "text-red-500 fill-transparent"
                    }`}
                  />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-xs text-gray-500">Description:</span>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {room.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {room.isBlocked ? (
            <div className="flex items-center gap-2 text-orange-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Temporarily Stopped</span>
            </div>
          ) : (
            <Button
              className="gap-2 bg-primary-600 hover:bg-primary-600/90 dark:bg-primary-600 dark:hover:bg-primary-500/90 px-5 dark:text-white"
              onClick={() =>
                handleEnterRoom?.(type, room.isPrivate || "", room.roomId)
              }
            >
              {type === "my-room" ? "Enter Room" : "Join Now"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Limit: {room.limit}</span>
            <div className="flex -space-x-2">
              {room.participants?.slice(0, 5).map((participant, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm"
                >
                  <img
                    src={participant.user?.avatar}
                    alt={participant.user?.userName}
                    className="w-full h-full object-cover"
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
