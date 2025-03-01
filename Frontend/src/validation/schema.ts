import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  captchaToken: yup.string().notRequired(),
});

export const registerSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export const verifyEmailSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const verifyPasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password must match")
    .required("Confirm Password is required"),
});

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
  country: yup
    .string()
    .required("Country is required")
    .min(3, "Country name must be at least 3 characters"),

  mobileNumber: yup
    .string()
    .required("Mobile Number is required")
    .min(10, "Mobile Number must be at least 10 characters"),
});

// export type verifyUserProfileSchemaType = yup.InferType<typeof validateProfileSchema>;
