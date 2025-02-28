import { LoginResponse } from "../../../../types";
import { LoginUser } from "../../../../types/user";
import { axiosInstancePublic } from "../api";

const login = async (data: LoginUser): Promise<LoginResponse> => {
  try {
    const response = await axiosInstancePublic.post(`/admin/auth/login`, data);
    return response.data;
  } catch (error: any) {
    if (error.isAxiosError) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data?.message || "Something went wrong";
      throw { statusCode, message };
    }

    throw new Error(error.message || "Something went wrong");
  }
};

export { login };
