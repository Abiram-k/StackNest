import { useForm, UseFormReturn, DefaultValues  } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {LoginUser} from "../../../types/user";

interface IFormProps{
    schema: yup.ObjectSchema<LoginUser>;
    defaultValues: DefaultValues<LoginUser>;
}

export function useLoginForm({schema, defaultValues}: IFormProps):UseFormReturn<LoginUser> {
  return useForm<LoginUser>({ // typing based on defaultValues
    resolver: yupResolver(schema),
    defaultValues:defaultValues
  });
}
