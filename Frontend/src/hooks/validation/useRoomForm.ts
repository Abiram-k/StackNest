import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RoomSchema } from "@/types";

interface IverifyRoomProps {
  schema: yup.ObjectSchema<RoomSchema>;
  defaultValues: DefaultValues<RoomSchema>;
}

export function useVerifyRoomForm({
  schema,
  defaultValues,
}: IverifyRoomProps): UseFormReturn<RoomSchema> {
  return useForm<RoomSchema>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}
