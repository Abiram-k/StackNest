import { PremiumFormType } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

interface useChallengeFormProp {
  schema: yup.ObjectSchema<PremiumFormType>;
  defaultValues: DefaultValues<PremiumFormType>;
}
export function usePremiumForm({
  schema,
  defaultValues,
}: useChallengeFormProp): UseFormReturn<PremiumFormType> {
  return useForm<PremiumFormType>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}
