import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface NotificationCardProps {
  name: string;
  timeAgo: string;
  mutualFriends?: string[];
  profileImage: string;
  notificationId: string;
  reason: string;
  message: string;
  priority: string;
  status: string;
  type: string;
  reportedId: string;
  onAccept: (notificationId: string) => void;
  onReject: (notificationId: string) => void;
}

export default function NotificationCard({
  notificationId,
  reportedId,
  type,
  onAccept,
  onReject,
  reason,
  message,
  name,
  timeAgo,
  priority,
  status,
  mutualFriends,
  profileImage,
}: NotificationCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out w-full max-w-xs">
      <div className="flex flex-col items-center relative">
        {priority === "high" && status === "pending" && (
          <div className="absolute top-0 -right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md animate-pulse">
            High Priority
          </div>
        )}

        {status === "pending" && priority !== "high" && (
          <div className="absolute top-0 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            pending
          </div>
        )}
        {status === "reviewed" && (
          <div className="absolute top-0 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            Resolved
          </div>
        )}

        {status === "dismissed" && (
          <div className="absolute top-0 -right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            Rejected
          </div>
        )}

        <div className="group relative">
          <Avatar className="w-28 h-28 border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105">
            <AvatarImage src={profileImage} alt={name} />
            <AvatarFallback className="text-4xl font-bold bg-gray-100">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-200 transition-all duration-300" />
        </div>

        <div className="mt-4 text-center space-y-2">
          <h3 className="font-bold text-xl text-gray-800">{name}</h3>

          <p className="text-red-500 text-sm font-medium">
            {formatDistanceToNow(new Date(timeAgo), { addSuffix: true })}
          </p>

          <div className="text-gray-600 text-sm space-y-1">
            <p className="font-semibold">
              Reason: <span className="text-blue-600">{reason}</span>
            </p>

            <p className="italic max-w-xs break-words">{message}</p>

            <p>
              Report on:{" "}
              <span className="text-purple-600 font-medium">{type}</span>
            </p>

            <p>
              {(type === "feed" || type === "room") && (
                <a
                  href={`/admin/${type}-management/${reportedId}/details`}
                  className="text-indigo-600 hover:underline text-sm font-medium block mt-1"
                >
                  View {type} details →
                </a>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4 w-full px-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            onClick={() => onAccept(notificationId)}
            disabled={status != "pending"}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            className="w-full text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-400 transition-colors duration-200 shadow-md hover:shadow-lg"
            onClick={() => onReject(notificationId)}
            disabled={status != "pending"}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

{
  /* {mutualFriends && (
        <div className="mt-4 text-center">
          <h3 className="font-bold text-xl">{name}</h3>
          <p className="text-red-500 text-sm">{timeAgo}</p>
          <p className="text-gray-600 text-sm mt-1 max-w-[200px]">
            {mutualFriends.slice(0, 2).join(", ")} and{" "}
            {mutualFriends.length - 2} other mutual friends
          </p>
        </div>
      )} */
}
