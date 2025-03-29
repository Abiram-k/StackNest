import CustomTable from "@/components/CustomTable";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { FallBackTable } from "@/components/FallBackTable";
import { useFetchAllFeeds } from "@/hooks/admin/feedManagement/useFetchAllFeeds";
import { useToggleBlockFeed } from "@/hooks/admin/feedManagement/useToggleBlockFeed";

type FeedRes = {
  _id: string;
  userId: {
    userName: string;
    avatar: string;
  };
  uploadedAt: string;
  title: string;
  content: string;
  media?: string;
  isBlocked: boolean;
  likes: number;
  comments: number;
};

const columns = [
  {
    key: "media" as keyof FeedRes,
    header: "Media",
    render: (feed: FeedRes) => {
      if (feed.media?.endsWith("mp4")) {
        return <p>Video preview unavailable</p>;
      } else {
        return (
          <img
            src={
              feed.media ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            alt="User Profile"
            width={50}
            className="rounded-full mx-auto"
          />
        );
      }
    },
  },
  { key: "title" as keyof FeedRes, header: "Title" },
  { key: "content" as keyof FeedRes, header: "Content" },
];

export default function FeedManagement() {
  const navigate = useNavigate();
  const { data, isPending: fetchFeedPending } = useFetchAllFeeds();
  const { mutate: blockFeed, isPending: blockPending } = useToggleBlockFeed();
  
  const handleViewMore = (feeId: string) => {
    navigate(`${feeId}/details`);
  };

  const handleBlockOrUnblockFeed = (feed: FeedRes) => {
    blockFeed(feed._id);
  };
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black ">
      {(fetchFeedPending || blockPending) && <Spinner />}

      <main className="flex-1 p-8 ">
        <div className=" flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-8">Feed Management</h1>
        </div>
        <div className=" mt-4 md:mt-8 lg:mt-12">
          {data?.availableFeeds?.length ? (
            <CustomTable
              onToggleAction={handleBlockOrUnblockFeed}
              data={data.availableFeeds}
              columns={columns}
              onViewMore={handleViewMore}
              toggleKey="isBlocked"
            />
          ) : (
            <FallBackTable
              mainTitle="No Banners founded"
              subTitle="Add new banner now"
            />
          )}
        </div>
      </main>
    </div>
  );
}
