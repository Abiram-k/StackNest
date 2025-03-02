import { LoginResponse } from "../../../../types/index";
import { LoginUser, typeRegisterUserWithOtp } from "../../../../types/user";
import { HttpService } from "../httpService";

export class UserAuthService {
  private httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  } 

  async login(data: LoginUser,role:string): Promise<LoginResponse> {
    return  this.httpService.post<LoginResponse>(`/${role}/auth/login`, data);
  }

  async initiateRegistration(data:{email: string}): Promise<void> {
    return this.httpService.post("/users/auth/initiate-registration", data);
  }

  async createUser(data: typeRegisterUserWithOtp): Promise<void> {
    return this.httpService.post("/users/auth/register", data);
  }

  async forgotPassword(data: { email: string }): Promise<void> {
    return this.httpService.post("/users/auth/forgot-password", data);
  }

  async resetPassword(data: {
    token?: string;
    password: string;
  }): Promise<void> {
    return this.httpService.post("/users/auth/reset-password", data);
  }

}

// const login = async (data: LoginUser): Promise<LoginResponse> => {
//   try {
//     const response = await axiosInstancePublic.post(`/users/auth/login`, data);
//     return response.data;
//   } catch (error: any) {
//     console.log("Error occured");
//     console.error(error);
//     if (error.isAxiosError)
//       throw new Error(error.response?.data.message || "Something went wrong");

//     throw new Error(error.message || "Something went wrong");
//   }
// };

// const initiateRegistration = async (email: string): Promise<void> => {
//   try {
//     const response = await axiosInstancePublic.post(
//       `/users/auth/initiate-registration`,
//       { email }
//     );
//     return response.data;
//   } catch (error: any) {
//     if (error.isAxiosError)
//       throw new Error(error.response?.data.message || "Something went wrong");

//     throw new Error(error.message || "Something went wrong");
//   }
// };

// const createUser = async (data: typeRegisterUserWithOtp): Promise<void> => {
//   try {
//     const response = await axiosInstancePublic.post(
//       `/users/auth/register`,
//       data
//     );
//     return response.data;
//   } catch (error: any) {
//     if (error.isAxiosError)
//       throw new Error(error.response?.data.message || "Something went wrong");

//     throw new Error(error.message || "Something went wrong");
//   }
// };

// const forgotPassword = async (data: { email: string }): Promise<void> => {
//   try {
//     const response = await axiosInstancePublic.post(
//       `/users/auth/forgot-password`,
//       data
//     );
//     return response.data;
//   } catch (error: any) {
//     if (error.isAxiosError)
//       throw new Error(error.response?.data.message || "Something went wrong");

//     throw new Error(error.message || "Something went wrong");
//   }
// };

// const resetPassword = async (data: {
//   token: string;
//   password: string;
// }): Promise<void> => {
//   try {
//     const response = await axiosInstancePublic.post(
//       `/users/auth/reset-password`,
//       data
//     );
//     return response.data;
//   } catch (error: any) {
//     if (error.isAxiosError)
//       throw new Error(error.response?.data.message || "Something went wrong");

//     throw new Error(error.message || "Something went wrong");
//   }
// };

// export {
//   login,
//   createUser,
//   initiateRegistration,
//   forgotPassword,
//   resetPassword,
// };
