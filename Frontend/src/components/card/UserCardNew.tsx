import type { FC } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserCardDetails } from "@/hooks/feeds/useGetUserCardDetails";
import { useNavigate } from "react-router-dom";

const UserCardNew = () => {
  const { data: userData } = useGetUserCardDetails();
  const navigate = useNavigate();
  const onViewProfile = () => {
    navigate("/user/profile");
  };

  return (
    <div
    className={`rounded-lg hidden lg:block shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 overflow-hidden max-w-xs w-full mb-10`}

    >
      <div className="bg-[#7848F4] dark:bg-[#5A32B8] h-12 relative"></div>

      <div className="bg-white  dark:bg-gray-800 px-4 pb-4 pt-12 relative">
        <div className="absolute -top-8 left-4">
          <div className="rounded-full border-2 border-white dark:border-gray-800 overflow-hidden h-16 w-16 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {userData?.data.avatarUrl ? (
              <img
                src={userData?.data.avatarUrl || "/placeholder.svg"}
                alt={userData?.data.userName}
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {userData?.data.userName}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            {userData?.data.description}
          </p>
        </div>

        <div className="flex justify-around mb-4">
          <div className="text-center">
            <span className="block text-xl font-bold text-gray-900 dark:text-white">
              {userData?.data.friendsCount}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Friends
            </span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-gray-900 dark:text-white">
              {userData?.data.feedsCount}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Feeds
            </span>
          </div>
        </div>

        <Button
          variant={"ghost"}
          onClick={onViewProfile}
          className="w-full py-2 bg-primary-500 hover:bg-[#6A3AD6] dark:bg-primary-600 dark:hover:bg-[#4D2A9E] text-sm text-white dark:text-white"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default UserCardNew;
