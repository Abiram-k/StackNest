import CustomTable from "@/components/CustomTable";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { FallBackTable } from "@/components/FallBackTable";
import { useFetchAllFeeds } from "@/hooks/admin/feedManagement/useFetchAllFeeds";
import { useToggleBlockFeed } from "@/hooks/admin/feedManagement/useToggleBlockFeed";
import FilterBar from "@/components/FilterBar";
import { useState } from "react";
import { useDebounce } from "@/hooks/optimizational/useDebounce";
import Pagination from "@/components/Pagination";
import FeedDetails from "./FeedDetails";
const delay = import.meta.env.VITE_DEBOUNCE_DELAY as number;

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

const filterOptions = [{ value: "Blocked" }];
const sortOptions = [
  { value: "MostViewed", label: "Most Viewed" },
  { value: "Latest" },
  { value: "Oldest" },
];
const columns = [
  {
    key: "media" as keyof FeedRes,
    header: "Media",
    render: (feed: FeedRes) => {
      if (feed.media?.endsWith("mp4")) {
        return <p>Video unavailable</p>;
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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const debounceSearchValue = useDebounce(search, delay);

  const navigate = useNavigate();

  const { data, isPending: fetchFeedPending } = useFetchAllFeeds(
    debounceSearchValue,
    filter,
    sort,
    currentPage,
    10
  );
  const { mutate: blockFeed, isPending: blockPending } = useToggleBlockFeed();

  const handleViewMore = (feeId: string) => {
    navigate(`${feeId}/details`);
  };

  const handleBlockOrUnblockFeed = (feed: FeedRes) => {
    blockFeed(feed._id);
  };

  // if (loading) {
  //   return (
  //     <div className="container mx-auto p-6 max-w-4xl">
  //       <div className="flex items-center mb-6">
  //         <Skeleton className="h-10 w-10 rounded-full" />
  //         <div className="ml-4 space-y-2">
  //           <Skeleton className="h-4 w-[250px]" />
  //           <Skeleton className="h-4 w-[200px]" />
  //         </div>
  //       </div>
  //       <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
  //       <div className="space-y-2">
  //         <Skeleton className="h-4 w-full" />
  //         <Skeleton className="h-4 w-full" />
  //         <Skeleton className="h-4 w-2/3" />
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="flex h-content">
      {(fetchFeedPending || blockPending) && <Spinner />}
      <div className="flex-1  p-8">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
          Feed Management
        </h1>

        <FilterBar
          setSearchQuery={setSearch}
          setFilterQuery={setFilter}
          setSortedOrder={setSort}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
        />

        <div className=" w-full flex justify-center items-center py-4">
          <div className="w-full max-w-5xl">
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
                mainTitle="No Feeds founded"
                subTitle="Not users shared feeds yet. Try again later! "
              />
            )}
          </div>
        </div>
        {data?.availableFeeds && data?.availableFeeds.length > 0 && (
          <Pagination
            onPageChange={setCurrentPage}
            totalPages={data?.totalPages || 0}
          />
        )}
      </div>
    </div>
  );
}
