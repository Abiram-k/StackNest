import * as yup from "yup";

export const validateProfileSchema = yup.object({
    userName: yup
      .string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
  
    firstName: yup
      .string()
      .required("First name is required")
      .min(3, "First name must be at least 3 characters"),
  
    gender: yup.string().optional(),
  
    description: yup.string().optional(),
    avatar:yup.string().optional(),
    email:yup.string().optional(),
    country:yup.string().optional(),
    mobileNumber:yup.string().optional(),
    streak:yup.number().optional(),
    streakClaimDate:yup.date().optional(),
    
  });
  
  