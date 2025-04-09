import { validateImage } from "@/utils/validateImage";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

type ProfileImageUploaderPropsType = {
  avatar: string | undefined;
  onImageChange: (file: File) => void;
  isEditing: boolean;
  containerClass?: string;
  avatarClass?: string;
  inputClass?: string;
  defaultAvatar: string;
  fallbackText: string;
  isVideoAllowed?: boolean;
};

const ImageUploader = ({
  defaultAvatar,
  avatar,
  onImageChange,
  isEditing,
  containerClass,
  avatarClass,
  inputClass,
  fallbackText,
  isVideoAllowed,
}: ProfileImageUploaderPropsType) => {
  const [imagePreview, setImagePreview] = useState(avatar);
  useEffect(() => {
    setImagePreview(avatar || defaultAvatar);
  }, [avatar, defaultAvatar]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (isVideoAllowed && file.name.endsWith("mp4")) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("video must be under 50MB.");
        return false;
      }
      toast.success("Video addedd");
    } else {
      if (!validateImage(file)) return false;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageChange(file);
  };

  return (
    <div className={` ${containerClass}`}>
      <Avatar className={`${avatarClass}`}>
        <AvatarImage src={imagePreview} />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>

      {isEditing && (
        <input
          type="file"
          accept="image/"
          className={` ${inputClass}`}
          onChange={handleImageChange}
        />
      )}
    </div>
  );
};

export default ImageUploader;
