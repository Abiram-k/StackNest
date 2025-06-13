import { useMutation } from "@tanstack/react-query";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HttpService } from "@/api/httpService";
import { AdminService } from "@/api/admin/adminServices";
import { toast } from "sonner";

export const useBlockUser = () => {
  const httpService = new HttpService();
  const adminService = new AdminService(httpService);

  // const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (userName: string) => adminService.blockUser(userName),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["users"] });
      // queryClient.invalidateQueries({ queryKey: ["feedDetails"] });
      toast.dismiss();
      toast.success("Success");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to block user");
      toast.dismiss();
      toast.error("Error occured");
    },
  });

  return { mutate, isPending };
};
