import { AdminService } from "@/api/admin/adminServices";
import { HttpService } from "@/api/httpService";
import { useQuery } from "@tanstack/react-query";

type fetchAllUsersType = {
  filter: string;
  sort: string;
  search: string;
  currentPage: number;
};

export const useFetchAllUsers = ({
  filter,
  sort,
  search,
  currentPage,
}: Partial<fetchAllUsersType>) => {
  const httpService = new HttpService();
  const adminService = new AdminService(httpService);

  return useQuery({
    queryKey: ["users", filter, sort, search, currentPage],
    queryFn: () =>
      adminService.fetchAllUsers(
        `?filter=${filter}&sort=${sort}&search=${search}&page=${currentPage}&limit=10`
      ),
  });
};
