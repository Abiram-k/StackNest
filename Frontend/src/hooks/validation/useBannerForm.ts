import { BannerReq } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

interface IverifyBannerProps {
  schema: yup.ObjectSchema<BannerReq>;
  defaultValues: DefaultValues<BannerReq>;
}

export function useVerifyBannerForm({
  schema,
  defaultValues,
}: IverifyBannerProps): UseFormReturn<BannerReq> {
  return useForm<BannerReq>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}
