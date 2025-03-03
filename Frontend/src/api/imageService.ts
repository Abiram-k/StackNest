import { axiosResponse } from "../../../types/user";
import { HttpService } from "./httpService";

export class ImageService {
  private httpService: HttpService;
  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }
  async uploadImage(file: File, folderName: string): Promise<string> {

    const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;
    const CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("folder", folderName);
    const response = await this.httpService.post<
      axiosResponse & { secure_url: string }
    >(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
      formData
    );
    return response.secure_url;
  }
}
