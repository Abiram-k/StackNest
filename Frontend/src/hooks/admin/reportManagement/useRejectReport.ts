import { AdminService } from "@/api/admin/adminServices";
import { HttpService } from "@/api/httpService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRejectReport = () => {
  const httpService = new HttpService();
  const adminService = new AdminService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (reportId: string) => adminService.rejectReport(reportId),
    onSuccess: () => {
      toast.success("Report rejected");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject report");
    },
  });
  return { ...mutation };
};
