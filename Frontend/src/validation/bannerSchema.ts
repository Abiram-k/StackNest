import * as yup from "yup";
export const validateBannerSchema = yup.object({
  title: yup
    .string()
    .required("Title is required*")

    .min(4, "At least 4 letters required"),
  description: yup
    .string()
    .required("Description is required")
    .min(8, "At least 8 characters required"),
  image: yup.string().optional(),
});
