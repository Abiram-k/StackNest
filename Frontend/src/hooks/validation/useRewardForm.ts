import { ReqReward } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

interface IverifyRewardProps {
  schema: yup.ObjectSchema<ReqReward>;
  defaultValues: DefaultValues<ReqReward>;
}

export function useVerifyRewardForm({
  schema,
  defaultValues,
}: IverifyRewardProps): UseFormReturn<ReqReward> {
  return useForm<ReqReward>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}
