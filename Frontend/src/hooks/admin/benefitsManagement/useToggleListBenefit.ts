import { HttpService } from "@/api/httpService";
import { BenefitsService } from "@/api/public/benefitsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useToggleListBenefit = () => {
  const httpService = new HttpService();
  const benefitsService = new BenefitsService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (benefitId: string) => benefitsService.toggleListing(benefitId),
    onSuccess: () => {
      toast.success("Action done");
      queryClient.invalidateQueries({ queryKey: ["benefits"] });
    },
    onError: () => {
      toast.error("Action undone");
    },
  });

  return { ...mutation };
};
