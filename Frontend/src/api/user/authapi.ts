import { LoginResponse } from "../../../../types/index";
import { LoginUser, typeRegisterUserWithOtp } from "../../../../types/user";
import { axiosInstancePublic } from "../api";



const login = async (data: LoginUser): Promise<LoginResponse> => {
  try {
    const response = await axiosInstancePublic.post(`/auth/login`, data);
    return response.data;
  } catch (error: any) {
    console.log(error);
    if (error.isAxiosError)
      throw new Error(error.response?.data.message || "Something went wrong");

    throw new Error(error.message || "Something went wrong");
  }
};

const initiateRegistration = async (email: string): Promise<void> => {
  try {
    const response = await axiosInstancePublic.post(
      `/auth/initiate-registration`,
      { email }
    );
    return response.data;
  } catch (error: any) {
    if (error.isAxiosError)
      throw new Error(error.response?.data.message || "Something went wrong");

    throw new Error(error.message || "Something went wrong");
  }
};

const createUser = async (data: typeRegisterUserWithOtp): Promise<void> => {
  try {
    const response = await axiosInstancePublic.post(`/auth/register`, data);
    return response.data;
  } catch (error: any) {
    if (error.isAxiosError)
      throw new Error(error.response?.data.message || "Something went wrong");

    throw new Error(error.message || "Something went wrong");
  }
};

const forgotPassword = async (data: { email: string }): Promise<void> => {
  try {
    const response = await axiosInstancePublic.post(
      `/auth/forgot-password`,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.isAxiosError)
      throw new Error(error.response?.data.message || "Something went wrong");

    throw new Error(error.message || "Something went wrong");
  }
};

const resetPassword = async (data: {
  token: string;
  password: string;
}): Promise<void> => {
  try {
    const response = await axiosInstancePublic.post(
      `/auth/reset-password`,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.isAxiosError)
      throw new Error(error.response?.data.message || "Something went wrong");

    throw new Error(error.message || "Something went wrong");
  }
};

export {
  login,
  createUser,
  initiateRegistration,
  forgotPassword,
  resetPassword,
};
