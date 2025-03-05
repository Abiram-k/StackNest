import { useState } from "react";
import CustomTable from "@/components/CustomTable";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { useFetchAllUsers } from "@/hooks/admin/useFetchAllUsers";
import { useBlockUser } from "@/hooks/admin/useBlockUser";

const filterOptions = [
  { value: "Blocked" },
  { value: "Premium" },
  { value: "Google users" },
];

const sortOptions =[
  {value:"Ascending"},
  {value:"Descending"}
]

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useFetchAllUsers({
    filter,
    sort,
    search,
    currentPage,
  });

  const { isPending, mutate } = useBlockUser();

  const handleBlockUser = (userName: string) => {
    mutate(userName);
  };

  return (
    <div className="flex h-content">
      <div className="flex-1  p-8">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
          {(isLoading || isPending) && "Loading ... "}
          User Management
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
            <CustomTable
              data={data?.users}
              isToggleblockUser={handleBlockUser}
            />
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

export default UserManagement;
