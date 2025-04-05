import * as yup from "yup";

export const validateBenefitSchema = yup.object({
  name: yup
    .string()
    .required("Benefit name is required")
    .min(6, "Name must be at least 6 characters"),
  
  description: yup
    .string()
    .required("Description is required")
    .min(8, "Description must be at least 8 characters"),
});
