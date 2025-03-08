import {
  CheckCircleIcon,
  FlagIcon,
  Lock,
  ShieldIcon,
  UnlockIcon,
} from "lucide-react";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

interface UserCardProps {
  lastSeen: string;
  userName: string;
  avatar: string;
  gender: string;
  email: string;
  isBlocked: boolean;
  isCurrentUser: boolean;
  isVerified: boolean;
  isProcessing: boolean;
  onToggleBlock?: (userName: string) => void;
}

const UserCard = ({
  lastSeen,
  isProcessing,
  isCurrentUser,
  isVerified,
  userName,
  avatar,
  gender,
  email,
  isBlocked,
  onToggleBlock,
}: UserCardProps) => {
  const [blocked, setBlocked] = useState(isBlocked);

  const handleToggleBlock = () => {
    setBlocked(!blocked);
    if (onToggleBlock) onToggleBlock(userName);
  };

  return (
    <div className="max-w-sm rounded-lg h-fit bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-4">
      <div className="flex items-start justify-between h-fit">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Host Profile</h2>
        {!isCurrentUser && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            <ShieldIcon className="inline-block w-4 h-4 mr-1" />
            Admin View
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={avatar || "/default-avatar.png"}
            alt={`${userName}'s avatar`}
            className="w-20 h-20 rounded-full object-cover border-4 border-purple-100 hover:border-purple-200 transition-colors duration-300"
          />
          {isVerified && (
            <CheckCircleIcon className="absolute bottom-0 right-0 w-6 h-6 text-green-500 bg-white rounded-full" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-bold text-gray-800 truncate">
              {userName}
            </h2>
            <span className="text-sm text-gray-500 capitalize">({gender})</span>
          </div>
          <div className="mt-1">
            <p className="text-sm text-gray-600 truncate" title={email}>
              ✉️ {email}
            </p>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-2 gap-4 py-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Friends</p>
          <p className="text-xl font-bold text-purple-600">{friendsCount}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Rooms Created</p>
          <p className="text-xl font-bold text-purple-600">{totalRooms}</p>
        </div>
      </div> */}

      {!isCurrentUser && (
        <div className="space-y-2">
          <button
            onClick={handleToggleBlock}
            disabled={isProcessing}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
              blocked
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            } ${isProcessing ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isProcessing ? (
              <Spinner />
            ) : (
              <>
                {blocked ? (
                  <UnlockIcon className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
                {blocked ? "Unblock User" : "Block User"}
              </>
            )}
          </button>

          {/* <button className="w-full py-2.5 px-4 text-sm text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors">
            <FlagIcon className="w-4 h-4 mr-2 inline-block" />
            Report Profile
          </button> */}
        </div>
      )}

      {lastSeen && (
        <div className="text-xs text-gray-400 text-center mt-2">
          Last active: {lastSeen}
        </div>
      )}
    </div>
  );
};

export default UserCard;
