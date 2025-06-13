import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { useFetchAllUsers } from "@/hooks/admin/userManagement/useFetchAllUsers";
import { useBlockUser } from "@/hooks/admin/userManagement/useBlockUser";
import CustomTable from "@/components/CustomTable";
import { useDebounce } from "@/hooks/optimizational/useDebounce";
import { Spinner } from "@/components/ui/spinner";
import { IUser } from "@/types";
const delay = import.meta.env.VITE_DEBOUNCE_DELAY as number;

const filterOptions = [
  { value: "Blocked" },
  { value: "Premium" },
  { value: "Google users" },
];

const sortOptions = [{ value: "Ascending" }, { value: "Descending" }];

const columns = [
  {
    key: "avatar " as keyof IUser,
    header: "Profile",
    render: (user: IUser) => (
      <img
        src={
          user.avatar ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        }
        alt="User Profile"
        width={50}
        className="rounded-full mx-auto"
      />
    ),
  },
  { key: "userName" as keyof IUser, header: "User Name" },
  { key: "email" as keyof IUser, header: "Email" },
];

const UserManagement = () => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const debounceSearchValue = useDebounce(search, delay);

  const { data, isLoading: fetchIsLoading } = useFetchAllUsers({
    filter,
    sort,
    search: debounceSearchValue,
    currentPage,
  });

  const { isPending: BlockIsPending, mutate } = useBlockUser();
  
  

  const handleBlockUser = (user: IUser) => {
    mutate(user.userName);
  };

  return (
    <div className="flex h-content">
      {(BlockIsPending || fetchIsLoading) && <Spinner />}
      <div className="flex-1  p-8">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
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

            <CustomTable<IUser>
              data={data?.users}
              columns={columns}
              onToggleAction={handleBlockUser}
              toggleKey="isBlocked"
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
