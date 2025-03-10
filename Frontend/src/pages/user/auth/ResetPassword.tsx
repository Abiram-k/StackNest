import { Form } from "@/components/forms/Form";
import { verifyPasswordSchema } from "@/validation/authSchema";
import { useVerifyPassword } from "@/hooks/validation/useLoginForm";
import { useSearchParams } from "react-router-dom";
import { verifyPasswordSchemaType } from "../../../../../types/user";
import { useResetPassword } from "@/hooks/auth/useResetPassword";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useVerifyPassword({
    schema: verifyPasswordSchema,
    defaultValues: { password: "", confirmPassword: "" },
  });
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const { mutate, isPending } = useResetPassword();

  const onSubmit = (data: verifyPasswordSchemaType) => {
    console.log(data);
    if (token) mutate({ token, ...data });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300 ease-in-out">
          <Form
            inputs={[
              {
                id: "password",
                label: "password",
                type: "password",
                name: "password",
                placeholder: "Enter 8 Digit Password...",
              },
              {
                id: "confirmPassword",
                label: "Confirm Password",
                type: "password",
                name: "confirmPassword",
                placeholder: "Re enter password",
              },
            ]}
            onSubmit={handleSubmit(onSubmit)}
            buttonText="Submit"
            isRegister={true}
            isOAuth={false}
            primaryTitle="Change Your Password"
            secondaryTitle="Update to your password and login "
            register={register}
            linkTitle="Remember your password?"
            linkText="SignIn"
            linkRedirect="/auth/login"
            errors={errors}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
