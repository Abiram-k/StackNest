import { normalizeDate } from "@/utils/normalizeDate";
import * as yup from "yup";

export const validateFeedSchema = yup.object({
  title: yup
    .string() 
    .required("Title is required *")
    .min(4, "At least 4 letters required *"),
    content: yup
    .string()
    .required("Content is required *")
    .min(8, "At least 8 characters required *"),

  scheduledAt: yup
    .date()
    .transform((_, originalValue) => {
      return originalValue ? new Date(originalValue) : null;
    })
    .min(normalizeDate(new Date()), "Scheduled date must be in the future")
    .nullable(),

    media: yup.string().optional()
});
