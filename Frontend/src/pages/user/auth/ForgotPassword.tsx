import { useState } from "react";
import { Form } from "@/components/Form";
import { verifyEmailSchema } from "@/validation/schema";
import { useVerifyEmail } from "@/hooks/useForm";
import { ArrowLeftButton } from "@/components/ArrowLeftButton";
import { EmailSendedSuccess } from "@/components/EmailSendedSucess";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/user/authapi";
import toast from "react-hot-toast";

 const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useVerifyEmail({
    schema: verifyEmailSchema,
    defaultValues: { email: "" },
  });

  const { mutate, reset, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setIsSuccess(true);
      reset();
    },
    onError: (error:any) => {
      toast.error(error.message)
      setIsSuccess(false);
      reset();
    },
  });

  const onSubmit = (data: { email: string }) => {
    setEmail(data?.email);
    mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <ArrowLeftButton />
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300 ease-in-out">
          {!isSuccess ? (
            <Form
              inputs={[
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  name: "email",
                  placeholder: "me@example.com",
                },
              ]}
              onSubmit={handleSubmit(onSubmit)}
              buttonText="Verify"
              isRegister={true}
              isOAuth={false}
              primaryTitle="Forgot Password"
              secondaryTitle="We'll send you a link to reset your password"
              register={register}
              linkText="Remember your password?"
              linkRedirect="/user/auth/login"
              errors={errors}
              isPending={isPending}
            />
          ) : (
            <EmailSendedSuccess email={email} setIsSuccess={setIsSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;