import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { errorText } from "./ui/errorText";
import GoogleAuth from "./authBotton/googleLoginbtn";
import GithubAuth from "./authBotton/githubAuth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type inputTypes = {
  id: string;
  label: string;
  type: string;
  name: string;
  placeholder: string;
};
type FormProps = React.ComponentPropsWithoutRef<"form"> & {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  register: any;
  errors: any;
  secondaryTitle: string;
  primaryTitle: string;
  isPending?: boolean;
  isRegister?: boolean;
  buttonText: string;
  linkText?: string;
  linkRedirect?: string;
  inputs: Array<inputTypes>;
  isOAuth?: boolean;
};

export const Form = ({
  className,
  primaryTitle,
  secondaryTitle,
  register,
  errors,
  onSubmit,
  isRegister = false,
  isOAuth = true,
  inputs,
  linkText,
  linkRedirect,
  buttonText,
  isPending,
  ...props
}: FormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={onSubmit}
    >
      <div className={"flex flex-col items-center gap-2 text-center"}>
        <h1 className="text-2xl font-bold">{primaryTitle}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {secondaryTitle}
        </p>
      </div>
      <div className="grid gap-6">
        {inputs?.map((input, index) => (
          <div className={`grid ${isRegister ? "gap-0" : "gap-2"}`} key={index}>
            {isOAuth && !isRegister && input.type == "password" ? (
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/auth/verify-email"
                  className="ml-auto text-sm underline-offset-4 hover:underline mb-1"
                >
                  Forgot your password?
                </Link>
              </div>
            ) : (
              <Label htmlFor={input.name} className="mb-2">
                {input.label}
              </Label>
            )}

            {/* <Input
              id={input.name}
              type={input.type}
              placeholder={input.placeholder}
              {...register(input.name)}
            /> */}
            <div className="relative">
              <Input
                id={input.name}
                type={
                  input.type == "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : input.type
                }
                value={input.type}
                placeholder={input.placeholder}
                {...register(input.name)}
              />
              {input.type === "password" && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
            {errorText(errors, input.name)}
          </div>
        ))}
        {errors.root && (
          <p className="text-red-500 text-sm">{errors.root.message}</p>
        )}
        {/* {isRegister ? (
          <OtpModal onSubmit={onSubmit} />
        ) : ( */}
        <Button
          type="submit"
          className={`${
            isPending && "cursor-progress"
          } "w-full  bg-primary-500 dark:bg-primary-600 hover:bg-[#4a43c4] dark:hover:bg-[#4a43c4]/90 cursor-pointer"`}
        >
          {isPending ? `${buttonText} ... ` : buttonText}
        </Button>
        {/* )} */}

        {isOAuth && (
          <>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 -z-10 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <GoogleAuth />
            <GithubAuth />
          </>
        )}
      </div>

      {linkText && (
        <div className="text-center text-sm">
          {linkText}
          <Link
            to={linkRedirect ? linkRedirect : "#"}
            className="underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      )}
    </form>
  );
};
