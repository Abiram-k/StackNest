import { GalleryVerticalEnd } from "lucide-react";
import { useRegisterForm } from "@/hooks/validation/useLoginForm";
import { registerSchema } from "@/validation/authSchema";
import { RegisterUser } from "../../../../../types/user";
import { Form } from "@/components/forms/Form";
import { Link } from "react-router-dom";
import images from "../../../assets/login-img.jpg";
import logo from "../../../assets/stacknest-logo.png";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import OtpModal from "@/components/OtpModal";
import { Spinner } from "@/components/ui/spinner";
import { useInitiateRegistration } from "@/hooks/useInitiateRegistration";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";

const RegisterPage = () => {
  const [userData, setUserData] = useState<RegisterUser>({
    name: "",
    email: "",
    password: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRegisterForm({
    schema: registerSchema,
    defaultValues: { email: "", password: "", name: "", confirmPassword: "" },
  });

  const { initiateRegistrationMutate, initiatingPending } =
    useInitiateRegistration(setIsModalOpen);

  const { verifyOtpMutate, verifyOtpPending } = useVerifyOtp(setIsModalOpen);


  const onSubmit = (data: RegisterUser) => {
    setUserData(data);
    initiateRegistrationMutate({email:data.email});
  };

  const verifyOtp = (otp: string) => {
    setIsModalOpen(false);
    verifyOtpMutate({ otp, ...userData });
  };

  return (
    <>
      {(verifyOtpPending || initiatingPending) && (
        <div className="relative isolate">
          <Spinner />
        </div>
      )}
      <div className="grid min-h-svh lg:grid-cols-2">
        <OtpModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onVerifyOtp={verifyOtp}
          isPending={verifyOtpPending}
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
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENG_ID}
              >
                <Form
                  inputs={[
                    {
                      id: "name",
                      label: "Name",
                      type: "text",
                      name: "name",
                      placeholder: "Your Name",
                    },
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
                    {
                      id: "confirmPassword",
                      label: "Confirm Password",
                      type: "password",
                      name: "confirmPassword",
                      placeholder: "********",
                    },
                  ]}
                  onSubmit={handleSubmit(onSubmit)}
                  buttonText="Register"
                  isRegister={true}
                  primaryTitle="Register Now"
                  secondaryTitle="Enter your details below to register your account"
                  register={register}
                  linkTitle="Already have an account?"
                  linkText="SingIn"
                  linkRedirect="/auth/login"
                  errors={errors}
                  isPending={initiatingPending}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
        <div className=" hidden bg-muted lg:block">
          <img
            src={images}
            alt="Image"
            className=" inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
