import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { HttpService } from "@/api/httpService";
import { setUserCredentials } from "@/redux/slice/userSlice";
import { LoginUser } from "../../../../types/user";
import { UseFormSetError } from "react-hook-form";
import { setAdminCredentials } from "@/redux/slice/adminSlice";
import { UserAuthService } from "@/api/public/authService";
import { toast } from "sonner";

export const useLogin = (
  setError: UseFormSetError<LoginUser>,
  role: string
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const captchaRef = useRef<any>(null);
  const captchaTokenRef = useRef<string>("");
  const [enableCaptcha, setEnableCaptcha] = useState(false);

  const httpService = new HttpService();
  const userAuthService = new UserAuthService(httpService);

  const mutation = useMutation({
    mutationFn: (data: LoginUser) => userAuthService.login(data, role),
    onSuccess: (data) => {
      toast.dismiss();
      toast.success(data?.message || "Login successful");
      setEnableCaptcha(false);
      if (role == "user") {
        dispatch(setUserCredentials({}));
        navigate("/user/home");
      } else {
        dispatch(setAdminCredentials({}));
        navigate("/admin/dashboard");
      }
      mutation.reset();
    },
    onError: (error: any) => {
      captchaRef.current?.reset();
      captchaTokenRef.current = "";

      if (error.message === "Captcha required") {
        setEnableCaptcha(true);
        return;
      }
      setEnableCaptcha(false);
      console.error("Login failed:", error);
      toast.dismiss();

      toast.error(error.message || "Something went wrong!");
      mutation.reset();
    },
  });

  return {
    ...mutation,
    enableCaptcha,
    captchaRef,
    captchaTokenRef,
  };
};
