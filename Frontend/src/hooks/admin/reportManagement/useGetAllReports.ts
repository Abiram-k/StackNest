
import { AdminService } from "@/api/admin/adminServices";
import { HttpService } from "@/api/httpService";
import { useQuery } from "@tanstack/react-query";

type fetchAllReportsPropType = {
  filter: string;
  sort: string;
  currentPage: number;
};

export const useGetAllReports = ({
  filter,
  sort,
  currentPage,
}: fetchAllReportsPropType) => {
  const httpService = new HttpService();
  const adminService = new AdminService(httpService);

  return useQuery({
    queryKey: ["reports", filter, sort, currentPage],
    queryFn: () =>
      adminService.getAllReports(
        `?filter=${filter}&sort=${sort}&page=${currentPage}&limit=8`
      ),
  });
};
