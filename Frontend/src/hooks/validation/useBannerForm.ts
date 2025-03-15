import { BannerRes } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

interface IverifyBannerProps {
  schema: yup.ObjectSchema<BannerRes>;
  defaultValues: DefaultValues<BannerRes>;
}
 
export function useVerifyBannerForm({
  schema,
  defaultValues,
}: IverifyBannerProps): UseFormReturn<BannerRes> {
  return useForm<BannerRes>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}
