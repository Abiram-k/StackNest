import PremiumAddCard from "@/components/card/PremiumAddCard";
import UserCardNew from "@/components/card/UserCardNew";
import { FallBackTable } from "@/components/FallBackTable";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import FeedItem from "@/components/user/FeedItem";
import { useGetLikedFeeds } from "@/hooks/feeds/useGetLikedFeeds";
import { useGetSingleFeed } from "@/hooks/feeds/useGetSingleFeed";
import { useToggleLikeFeed } from "@/hooks/feeds/useToggleLikeFeed";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const filterOptions = [{ value: "Oldest" }, { value: "Latest" }];

const SingleFeed = () => {
  const navigate = useNavigate();
  const { feedId } = useParams<{ feedId: string }>();
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [search, setSearch] = useState("");
  const { mutate: mutateLikeFeed, isPending: pendingLikeFeed } =
    useToggleLikeFeed();
  const { data: likedFeedsData, isPending: fetchingLikedFeedsPending } =
    useGetLikedFeeds();

  const handleLikeFeed = (feedId: string) => {
    mutateLikeFeed(feedId);
  };

  const { data: feedData, isPending } = useGetSingleFeed(feedId!);

  return (
    <div>
      <main className="lg:flex lg:ms-2 ">
        <div className="flex flex-col gap-2 mt-10">
          <UserCardNew />
          <PremiumAddCard />
        </div>
        <main className="flex-1 p-6 max-w-4xl mx-auto w-full  border border-y-0 rounded dark:border-gray-800 h-screen overflow-y-scroll overflow-x-hidden mb-5 md:mb-40 scrollbar-thin">
          {(isPending || pendingLikeFeed || fetchingLikedFeedsPending) && (
            <Spinner />
          )}
          <div
            className="mb-12 w-full relative"
            onClick={() => navigate("/user/highlights")}
          >
            <FilterBar
              placeHolder="Search Users . . . "
              filterOptions={filterOptions}
              setFilterQuery={() => {}}
              setSortedOrder={() => {}}
              setSearchQuery={setSearch}
            />
          </div>
          <div className="flex justify-between items-center md:mb-16 mb-8">
            <h1 className="text-3xl font-bold dark:text-white">Highlights</h1>
          </div>

          <div className="space-y-8">
            {feedData?.feed.isBlocked || feedData ? (
              <FeedItem
                key={feedData.feed.feedId}
                {...feedData.feed}
                isSingleFeed={true}
                handleLikeFeed={handleLikeFeed}
                isLikedFeed={likedFeedsData?.likedFeeds.some(
                  (id) => id == feedData.feed.feedId
                )}
              />
            ) : (
              <FallBackTable
                mainTitle="No post are there"
                subTitle="Check the url and try again!"
              />
            )}
          </div>
        </main>
      </main>
    </div>
  );
};

export default SingleFeed;
