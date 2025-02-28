import { useLoginForm } from "@/hooks/useForm";
import { useMutation } from "@tanstack/react-query";
import { loginSchema } from "@/validation/schema";
import { LoginUser } from "../../../../../types/user";
import { useRef, useState } from "react";
import { login } from "@/api/user/authapi";
import { Form } from "@/components/Form";
import images from "../../../assets/login-img.jpg";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { Captcha } from "@/components/Captcha";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAxiosWithAuth } from "@/api/api";
import Logo from "@/components/Logo";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slice/userSlice";
import { useNavigate } from "react-router-dom"; 

const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const LoginPage = () => {
  const captchaRef = useRef<ReCAPTCHA>(null);
  const captchaTokenRef = useRef<string>("");
  const [enableCaptcha, setEnableCaptcha] = useState<boolean>(false);
  const axiosPrivate = useAxiosWithAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit, 
    formState: { errors },
  } = useLoginForm({ 
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending, reset } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data && data.accessToken) {
        console.log(data);
        axiosPrivate.updateToken(data.accessToken);
      }
      toast.success(data?.message || "Login successful");
      setEnableCaptcha(false);
      dispatch(setCredentials({}));
      navigate("/user/home"); 
      reset(); 
    },
    onError: (error) => {
      captchaRef.current?.reset();
      captchaTokenRef.current = "";
      if (error.message == "Captcha required") {
        setEnableCaptcha(true);
        return;
      }
      setEnableCaptcha(false);
      console.error("Login failed:", error);
      toast.error(error.message || "Something went wrong!");
      reset();
    },
  });

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
        <Logo />
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
                    type: "email",
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
                buttonText="Sing in"
                primaryTitle="Welcome Dev ! "
                secondaryTitle="Enter your email below to login to your account"
                register={register}
                errors={errors}
                linkText="Don't have an account?"
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
