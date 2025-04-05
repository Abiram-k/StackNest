import { HttpService } from "@/api/httpService";
import { BenefitsService } from "@/api/public/benefitsService";
import { ReqBenefits } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useUpdateBenefits = () => {
  const httpService = new HttpService();
  const benefitsService = new BenefitsService(httpService);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: ({
      benefitId,
      data,
    }: {
      benefitId: string;
      data: ReqBenefits;
    }) => benefitsService.updateBenefits(benefitId, data),
    onSuccess: () => {
      toast.success("benefit updated");
      queryClient.invalidateQueries({ queryKey: ["benefits"] });
      navigate(-1);
    },
    onError: () => {
      toast.error("Failed to updated benefits");
    },
  });

  return { ...mutation };
};
