import * as yup from "yup";

export const validateProfileSchema = yup.object({
  userName: yup
    .string()
    .transform((value) => value.trim())
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .test(
      "no-spaces",
      "Username cannot contain spaces",
      (value) => !value || !/\s/.test(value)
    )
    .test(
      "starts-with-letter",
      "Username must start with a letter",
      (value) => !value || /^[a-zA-Z]/.test(value)
    )
    .trim("Username cannot have leading or trailing spaces"),

  firstName: yup
    .string()
    .transform((value) => value.trim())
    .required("First name is required")
    .min(3, "First name must be at least 3 characters"),

  gender: yup.string().optional(),

  description: yup.string().optional(),
  avatar: yup.string().optional(),
  email: yup.string().optional(),
  country: yup.string().optional(),
  mobileNumber: yup.string().optional(),
  streak: yup.number().optional(),
  streakClaimDate: yup.date().optional(),
  isVerified: yup.boolean().optional(),
  isChatBotAuthorise: yup.boolean().optional(),
});
