import { axiosInstance } from "./apiSevice";

export class HttpService {
  async get<T>(url: string): Promise<T> {
    try {
      const response = await axiosInstance.get<T>(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  async put<T>(url: string, data: any): Promise<T> {
    try {
      const response = await axiosInstance.put<T>(url, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await axiosInstance.post<T>(url, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  async delete<T>(url: string): Promise<T> {
    try {
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.isAxiosError)
      return new Error(error.response?.data.message || "Something went wrong");
    return new Error(error.message || "Something went wrong");
  }
  
}
