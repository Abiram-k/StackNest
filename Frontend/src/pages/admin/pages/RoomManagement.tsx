import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { useFetchAllRooms } from "@/hooks/room/useFetchRooms";
import { Spinner } from "@/components/ui/spinner";
import CustomTable, { Column } from "@/components/CustomTable";
import { IRoom } from "@/api/roomService";
import { useNavigate } from "react-router-dom";

const filterOptions = [
  { value: "Live" },
  { value: "Private" },
  { value: "Premium" },
];

const columns: Column<IRoom>[] = [
  {
    key: "title" as keyof IRoom,
    header: "Title",
  },
  { key: "description" as keyof IRoom, header: "Description" },
  { key: "status" as keyof IRoom, header: "Status" },
];

const RoomManagement = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { data, isLoading } = useFetchAllRooms("admin", {
    filter,
    sort,
    search,
    currentPage,
  });

  const handleVeiwMore = (id: string) => {
    navigate(`/admin/room-management/${id}/details`);
  };

  return (
    <div className="flex h-content">
      {isLoading && <Spinner />}
      <div className="flex-1  p-8">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
          Room Management
        </h1>

        <FilterBar
          setSearchQuery={setSearch}
          setFilterQuery={setFilter}
          setSortedOrder={setSort}
          filterOptions={filterOptions}
        />

        <div className=" w-full flex justify-center items-center py-4">
          <div className="w-full max-w-5xl">
            {data?.rooms.length ? (
              <CustomTable
                data={data?.rooms}
                columns={columns}
                onViewMore={handleVeiwMore}
              />
            ) : (
              <h1 className="text-center text-gray-500">
                NO ROOMS ARE AVAILABLE
              </h1>
            )}
          </div>
        </div>

        <Pagination
          onPageChange={setCurrentPage}
          totalPages={data?.totalPage || 1}
        />
      </div>
    </div>
  );
};

export default RoomManagement;
