import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { UserAuthService } from "@/api/authService";
import { HttpService } from "@/api/httpService";
import toast from "react-hot-toast";
import { setCredentials } from "@/redux/slice/userSlice";
import { LoginUser } from "../../../types/user";
import { UseFormSetError } from "react-hook-form";

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
      console.log(data);
      toast.success(data?.message || "Login successful");
      setEnableCaptcha(false);
      dispatch(setCredentials({}));
      if (role == "users") navigate("/user/home");
      else navigate("/admin/dashboard");
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
