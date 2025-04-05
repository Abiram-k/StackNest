import { ReqBenefits } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

interface IverifyBannerProps {
  schema: yup.ObjectSchema<ReqBenefits>;
  defaultValues: DefaultValues<ReqBenefits>;
}

export function useVerifyBenefitForm({
  schema,
  defaultValues,
}: IverifyBannerProps): UseFormReturn<ReqBenefits> {
  return useForm<ReqBenefits>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}
