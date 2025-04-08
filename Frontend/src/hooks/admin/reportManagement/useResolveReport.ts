import { AdminService } from "@/api/admin/adminServices";
import { HttpService } from "@/api/httpService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useResolveReport = () => {
  const httpService = new HttpService();
  const adminService = new AdminService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (reportId: string) => adminService.resolveReport(reportId),
    onSuccess: () => {
      toast.success("Report resolved");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resolve report");
    },
  });
  return {...mutation};
};
