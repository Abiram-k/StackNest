import { GalleryVerticalEnd } from "lucide-react";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useMutation } from "@tanstack/react-query";
import { loginSchema } from "@/validation/schema";
import { LoginUser } from "../../../../types/user";
import { useEffect, useRef } from "react";
import { login } from "@/api/user/authapi";
import { Form } from "@/components/form";
import { Link } from "react-router-dom";
import images from "../../assets/login-img.jpg";
import toast from "react-hot-toast";
import logo from "../../assets/stacknest-logo.png";
import ReCAPTCHA from "react-google-recaptcha";
import { Captcha } from "@/components/Captcha";

export const LoginPage = () => {
  const captchaRef = useRef<ReCAPTCHA>(null);
  const captchaTokenRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm({
    schema: loginSchema,
    defaultValues: { email: "", password: "", captchaToken: "" },
  });

  const { mutate, isPending, reset } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data);
      toast.success(data?.message || "Login successful");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error(error.message || "Something went wrong!");
    },
  });

  const onSubmit = (data: LoginUser) => {
    mutate(data);
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <Captcha
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
              ref={captchaRef}
              onVerify={(token: string | null) => {
                captchaTokenRef.current = token || "";
              }}
            />
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
              <img src={logo} alt="stack nest logo icon" />
            </div>
            Stack Nest
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Form
              onSubmit={handleSubmit(onSubmit)}
              primaryTitle="Login to your account"
              secondaryTitle="Enter your email below to login to your account"
              register={register}
              errors={errors}
              isPending={isPending}
            />
            
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
