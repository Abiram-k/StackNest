import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import { RoomSchema } from "../../../../types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
