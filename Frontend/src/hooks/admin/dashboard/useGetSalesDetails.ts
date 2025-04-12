import { AdminService } from "@/api/admin/adminServices";
import { HttpService } from "@/api/httpService";
import { useQuery } from "@tanstack/react-query";

export const useGetSalesDetails = (
  type: "monthly" | "yearly",
  month?: string
) => {
  const httpService = new HttpService();
  const adminService = new AdminService(httpService);
  return useQuery({
    queryKey: ["sales_details", type, month],
    queryFn: () => adminService.getSalesDetails(type, month),
  });
};
