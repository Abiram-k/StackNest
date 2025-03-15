import { normalizeDate } from "@/utils/normalizeDate";
import * as yup from "yup";

export const validateRoomSchema = yup.object({
  title: yup
    .string()
    .required("Title is required*")
    .min(4, "At least 4 letters required"),
  description: yup
    .string()
    .required("Description is required")
    .min(8, "At least 8 characters required"),
  limit: yup
    .number()
    .typeError("Limit must be a number")
    .required("Limit is required")
    .max(20, "Maximum 20 allowed")
    .min(3, "Minimum 3 required"),
  isPremium: yup.string().default("No"),
  isPrivate: yup.string().default("No"),
  password: yup.string().when("isPrivate", {
    is: "Yes",
    then: (schema) =>
      schema
        .required("Password is required for private rooms")
        .min(6, "Password must be at least 6 characters long"),
    otherwise: (schema) => schema.notRequired(),
  }),

  scheduledAt: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : null;
    })
    .min(normalizeDate(new Date()), "Scheduled date must be in the future")
    .optional(),
});
