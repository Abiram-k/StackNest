import * as yup from "yup";

export const validateRewardSchema = yup.object({
  name: yup
    .string()
    .required("Reward name is required")
    .min(3, "Reward name must be at least 3 characters")
    .max(30, "Reward name must be at most 30 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(120, "Description must be at most 120 characters"),

  points_cost: yup
    .number()
    .required("Points cost is required")
    .positive("Points cost must be a positive number"),

  benefit_key: yup
    .string()
    .required("Benefit is required")
    
});
