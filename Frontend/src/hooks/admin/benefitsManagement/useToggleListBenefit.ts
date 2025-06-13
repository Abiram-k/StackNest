import { HttpService } from "@/api/httpService";
import { BenefitsService } from "@/api/public/benefitsService";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useToggleListBenefit = () => {
  const httpService = new HttpService();
  const benefitsService = new BenefitsService(httpService);
  // const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (benefitId: string) => benefitsService.toggleListing(benefitId),
    onSuccess: () => {
      toast.success("Action done");
      // queryClient.invalidateQueries({ queryKey: ["benefits"] });
    },
    onError: () => {
      toast.error("Action undone");
    },
  });

  return { ...mutation };
};
