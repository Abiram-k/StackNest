import { useForm, UseFormReturn, DefaultValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { verifyPasswordSchemaType, verifyUserProfileSchemaType } from "../../../../types/user";

type LoginSchemaType = {
  email: string;
  password: string;
};

interface ILoginFormProps {
  schema: yup.ObjectSchema<LoginSchemaType>;
  defaultValues: DefaultValues<LoginSchemaType>;
}

export function useLoginForm({
  schema,
  defaultValues,
}: ILoginFormProps): UseFormReturn<LoginSchemaType> {
  return useForm<LoginSchemaType>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}

type RegisterSchemaType = {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
};

interface IRegisterFormProps {
  schema: yup.ObjectSchema<RegisterSchemaType>;
  defaultValues: DefaultValues<RegisterSchemaType>;
}

export function useRegisterForm({
  schema,
  defaultValues,
}: IRegisterFormProps): UseFormReturn<RegisterSchemaType> {
  return useForm<RegisterSchemaType>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}

type verifyEmailSchemaType = {
  email: string;
};

interface IverifyEmailFormProps {
  schema: yup.ObjectSchema<verifyEmailSchemaType>;
  defaultValues: DefaultValues<verifyEmailSchemaType>;
}

export function useVerifyEmail({
  schema,
  defaultValues,
}: IverifyEmailFormProps): UseFormReturn<verifyEmailSchemaType> {
  return useForm<verifyEmailSchemaType>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}


interface IverifyPasswordFormProps {
  schema: yup.ObjectSchema<verifyPasswordSchemaType>;
  defaultValues: DefaultValues<verifyPasswordSchemaType>;
}

export function useVerifyPassword({
  schema,
  defaultValues,
}: IverifyPasswordFormProps): UseFormReturn<verifyPasswordSchemaType> {
  return useForm<verifyPasswordSchemaType>({
    resolver: yupResolver(schema),
    defaultValues,
  });
}

