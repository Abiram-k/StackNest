import UserCardNew from "@/components/card/UserCardNew";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStatsLeaderboard } from "@/hooks/user/userProfile/useGetStatsLeaderboard";
import React, { useState } from "react";

interface TableData {
  userName: string;
  avatar: string;
  count: number;
}

interface TableProps {
  title: string;
  data?: TableData[];
  type: "streak" | "points";
}

const LeaderboardTable: React.FC<TableProps> = ({ title, data, type }) => {
  return (
    <div className="mb-16 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="bg-orange-100 rounded-md p-3 mb-2">
        <div className="grid grid-cols-3 text-sm font-medium">
          <div className="px-2">Rank</div>
          <div className="px-2">UserName</div>
          <div className="px-2">{type === "streak" ? "Streak" : "Points"}</div>
        </div>
      </div>

      {data?.map((user, index) => (
        <div
          key={index}
          className="grid grid-cols-3 items-center mb-3 hover:bg-gray-50 rounded-md transition-colors"
        >
          <div className="flex items-center py-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0">
              <img
                src={
                  user.avatar ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="py-2 px-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {user.userName}
          </div>
          <div className="flex items-center py-2 px-2">
            {type === "streak" ? (
              <>
                <span className="mr-1">{user.count}</span>
                {type == "streak" && (
                  <span role="img" aria-label="fire">
                    🔥
                  </span>
                )}
              </>
            ) : (
              <span>{user.count}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const Leaderboard: React.FC = () => {
  const { data, isPending } = useGetStatsLeaderboard();
  console.log(data);

  if (isPending) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="ml-4 space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full justify-center md:justify-normal md:items-stretch items-center">
      <div className="flex flex-1  w-3/4 ">
        <div className="flex-1 p-4">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              {/* Stats Cards */}
              <div className="md:mb-8 mb-16 flex justify-between items-center">
                <div className="">
                  <div className="bg-orange-100 rounded-md p-4 mb-4 flex items-center md:w-fit">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center mr-4">
                      <span role="img" aria-label="coin">
                        🪙
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-2">
                        {data?.user.streakCount} streaks
                      </span>
                      <span role="img" aria-label="fire">
                        🔥
                      </span>
                    </div>
                  </div>

                  <div className="bg-orange-100 rounded-md py-4 px-6 flex items-center md:w-fit ">
                    <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center mr-4">
                      <span className="text-white font-bold">$</span>
                    </div>
                    <span className="text-lg font-bold mr-5">
                      {data?.user.points} Points
                    </span>
                  </div>
                </div>
                <UserCardNew />
              </div>

              <LeaderboardTable
                title="Streak Leaderboard"
                data={data?.streakTableData}
                type="streak"
              />

              <LeaderboardTable
                title="Points Leaderboard"
                data={data?.pointsTableData}
                type="points"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
