import { FallBackTable } from "@/components/FallBackTable";
import ConfirmationDialog from "@/components/modal/confirmationDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import FeedItem from "@/components/user/FeedItem";
import { useDeleteFeed } from "@/hooks/feeds/useDeleteFeed";
import { useGetLikedFeeds } from "@/hooks/feeds/useGetLikedFeeds";
import { useGetMyFeeds } from "@/hooks/feeds/useGetMyFeeds";
import { useToggleLikeFeed } from "@/hooks/feeds/useToggleLikeFeed";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyFeeds = () => {
  const navigate = useNavigate();
  const { data, isPending } = useGetMyFeeds();
  const [selectedFeedId, setSelectedFeedId] = useState<string>("");
  const [isConfirmatioOpen, setConfirmationOpen] = useState<boolean>(false);

  const { mutate: deleteFeedMutate, isPending: deletePending } =
    useDeleteFeed();
  const { mutate: mutateLikeFeed } = useToggleLikeFeed();
  const { data: likedFeedsData } = useGetLikedFeeds();

  const handleLikeFeed = (feedId: string) => {
    mutateLikeFeed(feedId);
  };

  const handleDeleteFeed = (feedId: string) => {
    setSelectedFeedId(feedId);
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteFeedMutate(selectedFeedId);
    setConfirmationOpen(false);
  };

  return (
    <main className="flex-1 p-6 max-w-4xl mx-auto w-full h-screen scrollbar-thin overflow-y-scroll md:-ms-1 mt-12">
      {(isPending || deletePending) && <Spinner />}
      {isConfirmatioOpen && (
        <ConfirmationDialog
          onCancel={() => setConfirmationOpen(false)}
          onConfirm={handleConfirmDelete}
          message="Are you sure to delete this feed ? "
        />
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Feeds</h1>
        <div className="flex items-center gap-4">
          <Button
            className="bg-primary-500 dark:bg-primary-600 dark:hover:bg-primary-600/90 hover:bg-primary-500/90 dark:text-white"
            onClick={() => navigate("/user/profile/feed/upload")}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Post
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {data?.myFeeds?.length ? (
          data?.myFeeds?.map((feed, index) => (
            <FeedItem
              key={index}
              {...feed}
              isSingleFeed={false}
              handleDelete={handleDeleteFeed}
              handleEdit={() => {}}
              handleLikeFeed={handleLikeFeed}
              isLikedFeed={likedFeedsData?.likedFeeds.some(
                (id) => id == feed.feedId
              )}
            />
          ))
        ) : (
          <FallBackTable
            mainTitle="No post were uploaded yet"
            subTitle="Get started by uploading a new post"
          />
        )}
      </div>
    </main>
  );
};

export default MyFeeds;
