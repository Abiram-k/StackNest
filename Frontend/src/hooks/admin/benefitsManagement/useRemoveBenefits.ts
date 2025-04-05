import { HttpService } from "@/api/httpService";
import { BenefitsService } from "@/api/public/benefitsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useRemoveBenefit = () => {
  const httpService = new HttpService();
  const benefitsService = new BenefitsService(httpService);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (benefitId: string) =>
      benefitsService.removeBenefits(benefitId),
    onSuccess: () => {
      toast.success("Benefits removed");
      queryClient.invalidateQueries({ queryKey: ["benefits"] });
    },
    onError: () => {
      toast.error("Failed to remove benefits");
    },
  });

  return { ...mutation };
};
