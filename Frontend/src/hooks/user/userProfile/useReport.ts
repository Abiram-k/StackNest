import { HttpService } from "@/api/httpService";
import { UserProfileService } from "@/api/user/userProfileService";
import { useSocket } from "@/lib/socket";
import { ReqReport } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useReport = (type: "user" | "room" |"feed" | "general",entityId:string) => {
  const httpService = new HttpService();
  const userService = new UserProfileService(httpService);
  const socket = useSocket();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data: ReqReport) => userService.report(data),
    onSuccess: () => {
      toast.success("Report Submitted");
      if (type == "room"){

        socket.emit("leave-room", entityId);
        socket.disconnect();
        navigate(-1);
      } 
    },
    onError: () => {
      toast.error("Failed Submission");
    },
  });
  return { ...mutation };
};
