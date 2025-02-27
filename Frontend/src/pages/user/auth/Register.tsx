import { GalleryVerticalEnd } from "lucide-react";
import { useRegisterForm } from "@/hooks/useForm";
import { useMutation } from "@tanstack/react-query";
import { registerSchema } from "@/validation/schema";
import { RegisterUser } from "../../../../../types/user";
import { Form } from "@/components/Form";
import { Link, useNavigate } from "react-router-dom";
import images from "../../../assets/login-img.jpg";
import toast from "react-hot-toast";
import logo from "../../../assets/stacknest-logo.png";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createUser, initiateRegistration } from "@/api/user/authapi";
import { useState } from "react";
import OtpModal from "@/components/OtpModal";
import { Spinner } from "@/components/ui/spinner";

export const RegisterPage = () => {
  const [userData, setUserData] = useState<RegisterUser>({
    name: "",
    email: "",
    password: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRegisterForm({
    schema: registerSchema,
    defaultValues: { email: "", password: "", name: "", confirmPassword: "" },
  });

  const {
    mutate: initiateRegistrationMutate,
    isPending: initiatingPending,
    reset: initiatingReset,
  } = useMutation({
    // mutationFn: createUser,
    mutationFn: initiateRegistration,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Otp Sended to your Gmail");
      setIsModalOpen(true);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      toast.error(error.message || "Something went wrong!");
      initiatingReset();
    },
  });

  const {
    mutate: verifyOtpMutate,
    isPending: verifyOtpPending,
    reset: VerifyOtpReset,
  } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Otp Verified");
      setIsModalOpen(false);
      navigate("/user/auth/login");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      toast.error(error.message || "Something went wrong!");
      VerifyOtpReset();
    },
  });

  const onSubmit = (data: RegisterUser) => {
    setUserData(data); // setting user data for registeration after otp verification
    initiateRegistrationMutate(data.email);
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
                  linkText="Already have an account?"
                  linkRedirect="/user/auth/login"
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
