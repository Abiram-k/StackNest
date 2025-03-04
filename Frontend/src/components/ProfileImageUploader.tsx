import { validateImage } from "@/utils/validateImage";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileImageUploaderPropsType = {
  avatar: string | undefined;
  onImageChange: (file: File) => void;
  isEditing: boolean;
};

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const ProfileImageUploader = ({
  avatar,
  onImageChange,
  isEditing,
}: ProfileImageUploaderPropsType) => {
  const [imagePreview, setImagePreview] = useState(avatar);

  useEffect(() => {
    setImagePreview(avatar || DEFAULT_AVATAR);
  }, [avatar]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!validateImage(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageChange(file);
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar className="w-12 h-12">
        <AvatarImage src={imagePreview} />
        <AvatarFallback>Profile Image</AvatarFallback>
      </Avatar>

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
};

export default ProfileImageUploader;
