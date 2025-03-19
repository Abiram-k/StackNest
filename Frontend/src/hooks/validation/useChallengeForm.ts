import { challegeType } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

interface useChallengeFormProp {
  schema: yup.ObjectSchema<challegeType>;
  defaultValues: DefaultValues<challegeType>;
}
export function useChallengeForm({
  schema,
  defaultValues,
}: useChallengeFormProp): UseFormReturn<challegeType> {
  return useForm<challegeType>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}
