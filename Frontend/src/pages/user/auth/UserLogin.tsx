import { useLoginForm } from "@/hooks/validation/useLoginForm";
import { loginSchema } from "@/validation/authSchema";
import { Form } from "@/components/forms/Form";
import images from "../../../assets/login-img.jpg";
import { Captcha } from "@/components/auth/Captcha";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Logo from "@/components/ui/Logo";
import { useLogin } from "@/hooks/auth/useLogin";
import useGitHubTokenValidation from "@/hooks/auth/useGitHubTokenValidation";
import { toast } from "sonner";
import { LoginUser } from "@/types";

const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm({
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending, enableCaptcha, captchaRef, captchaTokenRef } =
    useLogin("user");

  useGitHubTokenValidation();

  const onSubmit = (data: LoginUser) => {
    if (!captchaTokenRef.current && enableCaptcha) {
      toast.error("Please verify the captcha");
      return;
    }

    mutate({ captchaToken: captchaTokenRef.current, ...data });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2 ">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Logo isAdmin={false} />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {enableCaptcha && (
              <Captcha
                className=" scale-75 flex justify-center"
                sitekey={sitekey}
                ref={captchaRef}
                onVerify={(token: string | null) => {
                  captchaTokenRef.current = token || "";
                }}
              />
            )}
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENG_ID}
            >
              <Form
                inputs={[
                  {
                    id: "email",
                    label: "Email",
                    type: "text",
                    name: "email",
                    placeholder: "me@example.com",
                  },
                  {
                    id: "password",
                    label: "Password",
                    type: "password",
                    name: "password",
                    placeholder: "********",
                  },
                ]}
                isRegister={false}
                onSubmit={handleSubmit(onSubmit)}
                buttonText="Sign in"
                primaryTitle="Welcome Dev ! "
                secondaryTitle="Enter your email below to login to your account"
                register={register}
                errors={errors}
                linkTitle="Don't have an account?"
                linkText="SignUp"
                linkRedirect="/auth/register"
                isPending={isPending}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={images}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
export default LoginPage;
