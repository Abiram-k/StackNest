import { QueryClient, useMutation } from "@tanstack/react-query";
import { HttpService } from "@/api/httpService";
import { AdminService } from "@/api/admin/adminServices";
import toast from "react-hot-toast";

export const useBlockUser = () => {
  const httpService = new HttpService();
  const adminService = new AdminService(httpService);

  const queryClient = new QueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (userName: string) => adminService.blockUser(userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to block user");
    },
  });

  return { mutate, isPending };
};
