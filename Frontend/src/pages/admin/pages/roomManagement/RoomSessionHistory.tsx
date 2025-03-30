import { useState } from "react";
import Pagination from "@/components/Pagination";
import { Spinner } from "@/components/ui/spinner";
import CustomTable, { Column } from "@/components/CustomTable";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "@/hooks/optimizational/useDebounce";
import { RoomSessionType } from "@/types";
import { useFetchRoomSessionHistory } from "@/hooks/room/useFetchRoomSessionHistory";
import { formatSecondToTime } from "@/utils/formatSecondToTime";
import { toast } from "sonner";

const delay = import.meta.env.VITE_DEBOUNCE_DELAY as number;

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return { day, month, year, hours, minutes, ampm };
};

const columns: Column<RoomSessionType>[] = [
  {
    key: "userId" as keyof RoomSessionType,
    header: "UserName",
    render: (session: RoomSessionType) => (
      <img
        src={
          session.userId.avatar ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        }
        alt="User Profile"
        width={50}
        className="rounded-full mx-auto"
      />
    ),
  },
  {
    key: "userId" as keyof RoomSessionType,
    header: "UserName",
    render: (session: RoomSessionType) => <p>{session.userId.userName}</p>,
  },
  {
    key: "startTime" as keyof RoomSessionType,
    header: "Joined At",
    render: (session: RoomSessionType) => {
      const date = new Date(session.startTime);
      const { day, month, year, hours, minutes, ampm } = formatDate(date);
      return <p>{`${day}/${month}/${year} [${hours}:${minutes} ${ampm}]`}</p>;
    },
  },
  {
    key: "duration" as keyof RoomSessionType,
    header: "Duration",
    render: (session: RoomSessionType) => (
      <p>{formatSecondToTime(session.duration || 0)}</p>
    ),
  },
  {
    key: "endTime" as keyof RoomSessionType,
    header: "Leaved At",
    render: (session: RoomSessionType) => {
      if (session.endTime) {
        const date = new Date(session.endTime);
        const { day, month, year, hours, minutes, ampm } = formatDate(date);
        return <p>{`${day}/${month}/${year} [${hours}:${minutes} ${ampm}]`}</p>;
      }
    },
  },
];

const RoomSessionHistory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    toast.dismiss();
    toast.success("Room ID is missing!");
    return;
  }
  const debounceSearchValue = useDebounce(search, delay);

  const navigate = useNavigate();

  const { data, isLoading } = useFetchRoomSessionHistory(roomId, "admin", {
    filter,
    sort,
    search: debounceSearchValue,
    currentPage,
    limit: 10,
  });

  console.log("Room Session Data:  ", data);

  return (
    <div className="flex h-content">
      {isLoading && <Spinner />}
      <div className="flex-1  p-8">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">Room History</h1>

        {/* <FilterBar
          setSearchQuery={setSearch}
          setFilterQuery={setFilter}
          setSortedOrder={setSort}
        /> */}

        <div className=" w-full flex justify-center items-center py-4">
          <div className="w-full max-w-5xl">
            {data?.session.length ? (
              <CustomTable data={data.session} columns={columns} />
            ) : (
              <h1 className="text-center text-gray-500">
                ROOM HISTORY IS EMPTY
              </h1>
            )}
          </div>
        </div>

        <Pagination
          onPageChange={setCurrentPage}
          totalPages={data?.totalPages || 1}
        />
      </div>
    </div>
  );
};

export default RoomSessionHistory;
