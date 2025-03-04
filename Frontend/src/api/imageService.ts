import axios, { AxiosResponse } from "axios";

interface ICloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  resource_type: string;
}

export class ImageService {
  async uploadImage(file: File, folderName: string): Promise<string> {
    const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;
    const CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("folder", folderName);

    const response: AxiosResponse<ICloudinaryResponse> = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  }
}
