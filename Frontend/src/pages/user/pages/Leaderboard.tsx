import UserCardNew from "@/components/card/UserCardNew";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStatsLeaderboard } from "@/hooks/user/userProfile/useGetStatsLeaderboard";
import { Gift } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

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
    <div className="mb-16 w-full ">
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
    <div className="min-h-screen flex flex-col w-full justify-center md:justify-normal md:items-stretch items-center mb-20 mt-12">
      <div className="flex flex-1  w-3/4 ">
        <div className="flex-1 p-4">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              <div className="md:mb-8 mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col gap-4 w-full md:w-auto">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 dark:bg-yellow-500/80 flex items-center justify-center shrink-0">
                      <span role="img" aria-label="coin" className="text-xl">
                        🪙
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-orange-800 dark:text-orange-100">
                        {data?.user.streakCount}
                      </span>
                      <span className="text-xl" role="img" aria-label="fire">
                        🔥
                      </span>
                      <span className="text-orange-600 dark:text-orange-300">
                        Streaks
                      </span>
                    </div>
                  </div>

                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-400 dark:bg-green-600 flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-lg">$</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-orange-800 dark:text-orange-100">
                        {data?.user.points}
                      </span>
                      <span className="text-orange-600 dark:text-orange-300">
                        Points
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`rewards?userPoints=${data?.user.points}`}
                    className="group inline-flex items-center gap-4 rounded-lg px-6 py-4 transition-all duration-300 ease-in-out bg-yellow-400/10 hover:bg-yellow-400/20 dark:bg-yellow-500/10 dark:hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 dark:border-yellow-500/30 dark:hover:border-yellow-500/50 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    role="button"
                    aria-label="Claim Reward"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/80 transition-all group-hover:bg-yellow-500 group-hover:scale-110 dark:bg-yellow-500/20 dark:group-hover:bg-yellow-500/30">
                      <Gift className="h-5 w-5 text-yellow-700 transition-all group-hover:text-yellow-800 dark:text-yellow-300 dark:group-hover:text-yellow-200" />
                    </div>
                    <span className="text-lg font-semibold text-yellow-700 transition-colors group-hover:text-yellow-800 dark:text-yellow-300 dark:group-hover:text-yellow-200">
                      Claim Reward
                    </span>
                  </Link>
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
