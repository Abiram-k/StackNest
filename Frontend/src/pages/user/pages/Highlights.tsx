import { FallBackTable } from "@/components/FallBackTable";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import FeedItem from "@/components/user/FeedItem";
import { useGetAvailableFeeds } from "@/hooks/feeds/useGetAvailableFeeds";
import { useGetLikedFeeds } from "@/hooks/feeds/useGetLikedFeeds";
import { useGetUserSuggestion } from "@/hooks/feeds/useGetUserSuggestion";
import { useToggleLikeFeed } from "@/hooks/feeds/useToggleLikeFeed";
import { useDebounce } from "@/hooks/optimizational/useDebounce";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Highlights = () => {
  const navigate = useNavigate();

  const [filterQuery, setFilterQuery] = useState<string>("");
  const [sortQuery, setSortQuery] = useState<string>("");

  const [suggestedUserName, setSuggestedUserName] = useState<string[]>();

  const [search, setSearch] = useState("");
  const debounceValue = useDebounce(search, 500);

  const { data: availableFeedsData, isPending: fetchingIsPending } =
    useGetAvailableFeeds();

  const { mutate: mutateLikeFeed, isPending: pendingLikeFeed } =
    useToggleLikeFeed();

  const { data: likedFeedsData, isPending: fetchingLikedFeedsPending } =
    useGetLikedFeeds();

  const { data: userSuggestions } = useGetUserSuggestion(debounceValue);

  const handleLikeFeed = (feedId: string) => {
    mutateLikeFeed(feedId);
  };

  return (
    <main className="flex-1 p-6 max-w-4xl mx-auto w-full  border border-y-0 rounded dark:border-gray-800 h-screen overflow-y-scroll overflow-x-hidden mb-20 md:mb-40 scrollbar-thin">
      {(fetchingIsPending || pendingLikeFeed || fetchingLikedFeedsPending) && (
        <Spinner />
      )}
      <div className="mb-12 w-full relative">
        <FilterBar
          placeHolder="Search Users"
          filterOptions={[{ value: "Oldest" }, { value: "Latest" }]}
          sortOptions={[{ value: "MostLiked",label:"Most Liked" }]}
          setFilterQuery={setFilterQuery}
          setSortedOrder={setSortQuery}
          setSearchQuery={setSearch}
        />

        <div className="mt-2 bg-white  rounded-lg shadow-lg overflow-hidden absolute top-15 w-full md:w-1/2 z-10">
          <ul className="divide-y divide-gray-200">
            {userSuggestions &&
              userSuggestions?.length > 0 &&
              debounceValue.length >= 1 &&
              userSuggestions.map((user, index) => (
                <li
                  key={`${user}-${index}`}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <span className="text-gray-700 dark:text-white font-medium">
                    {user}
                  </span>
                </li>
              ))}
            {userSuggestions?.length == 0 && debounceValue.length >= 1 && (
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                <span className="text-gray-700 dark:text-white font-medium">
                  No result found !
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="flex justify-between items-center md:mb-16 mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Highlights</h1>

        <div className="flex items-center gap-4">
          <Button
            className="bg-primary-500 dark:bg-primary-600 dark:hover:bg-primary-600/90 hover:bg-primary-500/90 dark:text-white"
            onClick={() => navigate("/user/profile/feed/upload")}
          >
            <Plus className="h-5 w-5 " />
            Add New Post
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {availableFeedsData?.availableFeeds?.length ? (
          availableFeedsData.availableFeeds?.map((feed, index) => (
            <FeedItem
              key={index}
              {...feed}
              handleLikeFeed={handleLikeFeed}
              isLikedFeed={likedFeedsData?.likedFeeds.some(
                (id) => id == feed.feedId
              )}
            />
          ))
        ) : (
          <FallBackTable
            mainTitle="No post are there!"
            subTitle="Share your first post, be the first"
          />
        )}
      </div>
    </main>
  );
};

export default Highlights;
