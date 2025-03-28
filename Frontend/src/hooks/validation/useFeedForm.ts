import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FeedReqType } from "@/types";

interface IverifyFeedProps {
  schema: yup.ObjectSchema<FeedReqType>;
  defaultValues: DefaultValues<FeedReqType>;
}

export function useVerifyFeedForm({
  schema,
  defaultValues,
}: IverifyFeedProps): UseFormReturn<FeedReqType> {
  return useForm<FeedReqType>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}
