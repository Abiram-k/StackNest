import axios from "axios";
import {LoginResponse} from "../../../../types/index";
import {LoginUser} from "../../../../types/user";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const login = async (data: LoginUser): Promise<LoginResponse> => {
  try {

    const response = await axios.post(`${BASE_URL}/users/login`, data);
    return response.data;
    
  } catch (error: any) {

    if (error.isAxiosError) 
      throw new Error(error.response?.data.message || "Something went wrong");
    
    throw new Error(error.message || "Something went wrong");
  }
};


export { login };
