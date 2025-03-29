import axios, { AxiosResponse } from "axios";
import { data } from "react-router-dom";
import { HttpService } from "../httpService";

interface ICloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  resource_type: string;
}
interface ICloudinaryCredentials {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
}

export class ImageService {
  private readonly _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async uploadImage(
    file: File,
    folderName: string,
    cloudName: string,
    apiKey: string,
    signature: string,
    timestamp: number
  ): Promise<string> {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("folder", folderName);
    formData.append("type", "authenticated");
    const fileType = file.type.startsWith("video/") ? "video" : "image";

    const response: AxiosResponse<ICloudinaryResponse> = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/${fileType}/upload`,
      formData
    );
    return response.data.secure_url;
  }

  async getCloudinaryCredentials(): Promise<ICloudinaryCredentials> {
    return await this._httpService.get<ICloudinaryCredentials>(
      "/auth/cloudinary/sign"
    );
  }
  
}
