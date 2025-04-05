import { HttpService } from "@/api/httpService";
import { BenefitsService } from "@/api/public/benefitsService";
import { ReqBenefits } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useCreateBenefits = () => {
  const httpService = new HttpService();
  const benefitsService = new BenefitsService(httpService);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data: ReqBenefits) => benefitsService.addBenefits(data),
    onSuccess: () => {
      toast.success("New benefits added");
      queryClient.invalidateQueries({queryKey:["benefits"]})
      navigate(-1);
    },
    onError: () => {
      toast.error("Failed to add benefits");
    },
  });

  return { ...mutation };
};
