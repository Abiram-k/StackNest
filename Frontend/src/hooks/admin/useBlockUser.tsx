import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HttpService } from "@/api/httpService";
import { AdminService } from "@/api/admin/adminServices";
import toast from "react-hot-toast";

export const useBlockUser = () => {
  const httpService = new HttpService();
  const adminService = new AdminService(httpService);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (userName: string) => adminService.blockUser(userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Success");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to block user");
      toast.error("Error occured");
    },
  });

  return { mutate, isPending };
};
