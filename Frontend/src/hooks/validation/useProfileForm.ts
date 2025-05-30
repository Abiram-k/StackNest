import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { verifyUserProfileSchemaType } from "@/types";

interface IverifyUserProfileProps {
  schema: yup.ObjectSchema<verifyUserProfileSchemaType>;
  defaultValues: DefaultValues<verifyUserProfileSchemaType>;
}

export function verifyUserProfile({
  schema,
  defaultValues,
}: IverifyUserProfileProps): UseFormReturn<verifyUserProfileSchemaType> {
  return useForm<verifyUserProfileSchemaType>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}
