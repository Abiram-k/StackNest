import { HttpService } from "@/api/httpService";
import { ImageService } from "@/api/imageService";
import { validateImage } from "@/utils/validateImage";
import React, { useCallback, useState } from "react";

type ProfileImageUploaderPropsType = {
  onImageChange: (imageUrl: string) => void;
  isEditing: boolean;
};

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const ProfileImageUploader = React.memo(
  ({ onImageChange, isEditing }: ProfileImageUploaderPropsType) => {
    const [imagePreview, setImagePreview] = useState(DEFAULT_AVATAR);

    const handleImageChange = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!validateImage(file)) return;

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        try {
          const httpService = new HttpService();
          const imageService = new ImageService(httpService);
          const imageUrl = await imageService.uploadImage(file, "stackNest");
          onImageChange(imageUrl);
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      },

      [onImageChange]
    );

    return (
      <div className="flex flex-col items-center">
        <img
          src={imagePreview}
          width={60}
          height={60}
          className="rounded-full object-cover border border-gray-300 "
          alt="profile image"
        />

        {isEditing && (
          <input
            type="file"
            accept="image/"
            className="mt-2 text-xs text-gray-500 w-20  bg-gray-200 p-1 rounded"
            onChange={handleImageChange}
          />
        )}
      </div>
    );
  }
);

export default ProfileImageUploader;
