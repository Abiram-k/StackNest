import { AdminService } from "@/api/admin/adminServices";
import { HttpService } from "@/api/httpService";
import { useQuery } from "@tanstack/react-query";

export const useGetUserEngagement = (year: number) => {
  const httpService = new HttpService();
  const adminService = new AdminService(httpService);
  return useQuery({
    queryKey: ["user_engagement",year],
    queryFn: () => adminService.getUserEngagement(year),
  });
};
