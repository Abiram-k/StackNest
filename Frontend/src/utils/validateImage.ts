import toast from "react-hot-toast";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const validateImage = (file: File) => {
  
  if (!file.type.startsWith("image/")) {
    toast.error("Only image files are allowed (JPEG, PNG, GIF, etc.).");
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("File size must be less than 2MB.");
    return false;
  }

  return true;
};
