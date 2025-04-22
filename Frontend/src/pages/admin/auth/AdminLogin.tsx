import { GalleryVerticalEnd } from "lucide-react";
import { useLoginForm } from "@/hooks/validation/useLoginForm";
import { loginSchema } from "@/validation/authSchema";
import { Form } from "@/components/forms/Form";
import { Link } from "react-router-dom";
import images from "../../../assets/login-img.jpg";
import logo from "../../../assets/stacknest-logo.png";
import { useLogin } from "@/hooks/auth/useLogin";
import { LoginUser } from "@/types";

 const AdminLoginPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useLoginForm({
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useLogin(setError,"admin")

  const onSubmit = (data: LoginUser) => {
    mutate(data);
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2 ">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
              <img src={logo} alt="stack nest logo icon" loading="lazy" />
            </div>
            Stack Nest
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
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
              isOAuth={false}
              primaryTitle="Welcome Admin ! "
              secondaryTitle="Enter your email below to login to your account"
              register={register}
              errors={errors}
              linkText=""
              linkRedirect=""
              isPending={isPending}
              linkTitle=""
            />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={images}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          loading="lazy"
        />
      </div>
    </div>
  );
};


export default AdminLoginPage;