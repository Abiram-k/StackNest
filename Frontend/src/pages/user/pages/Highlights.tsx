import { FallBackTable } from "@/components/FallBackTable";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import FeedItem from "@/components/user/FeedItem";
import { useGetAvailableFeeds } from "@/hooks/feeds/useGetAvailableFeeds";
import { useGetLikedFeeds } from "@/hooks/feeds/useGetLikedFeeds";
import { useToggleLikeFeed } from "@/hooks/feeds/useToggleLikeFeed";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Highlights = () => {
  const navigate = useNavigate();

  const { data: availableFeedsData, isPending: fetchingIsPending } =
    useGetAvailableFeeds();

  const { mutate: mutateLikeFeed, isPending: pendingLikeFeed } =
    useToggleLikeFeed();

  const { data: likedFeedsData, isPending: fetchingLikedFeedsPending } =
    useGetLikedFeeds();

  const handleLikeFeed = (feedId: string) => {
    mutateLikeFeed(feedId);
  };

  return (
    <main className="flex-1 p-6 max-w-4xl mx-auto w-full  border border-y-0 rounded dark:border-gray-800 h-screen overflow-y-scroll overflow-x-hidden mb-20 md:mb-40 scrollbar-thin">
      {(fetchingIsPending || pendingLikeFeed || fetchingLikedFeedsPending) && (
        <Spinner />
      )}
      {/* {isConfirmatioOpen && (
            <ConfirmationDialog
              onCancel={() => setConfirmationOpen(false)}
              onConfirm={handleConfirmDelete}
              message="Are you sure to delete this feed ? "
            />
          )} */}
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
