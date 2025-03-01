import { verifyUserProfileSchemaType } from "../../../../types/user";
import { axiosInstance } from "../api";

const getUserProfile = async ():Promise<verifyUserProfileSchemaType> => {
  try {
    const response = await axiosInstance.get<verifyUserProfileSchemaType>("/users/details");
    return response.data;
  } catch (error: any) {
    if (error.isAxiosError)
      throw new Error(error.response?.data.message || "Something went wrong");

    throw new Error(error.message || "Something went wrong");
  }
};
 const updateProfile = async (data: verifyUserProfileSchemaType) => {
  try {
    const response = axiosInstance.put("/users/details",data);
    return response;
  } catch (error: any) {
    if (error.isAxiosError)
      throw new Error(error.response?.data.message || "Something went wrong");

    throw new Error(error.message || "Something went wrong");
  }
};



export {getUserProfile,updateProfile}