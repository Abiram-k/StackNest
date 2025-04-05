import * as yup from "yup";

export const validatePremiumSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),

  regularAmount: yup
    .number()
    .required("Regular amount is required")
    .positive("Regular amount must be a positive number"),

  discountAmount: yup
    .number()
    .required("Discount amount is required")
    .positive("Discount amount must be a positive number")
    .test(
      "is-less-than-regular",
      "Discount amount must be less than regular amount",
      function (value) {
        const { regularAmount } = this.parent;
        return value < regularAmount;
      }
    ),

  benefit1: yup
    .string()
    .default("")
    .test(
      "at-least-one-benefit",
      "At least one benefit is required",
      function (value) {
        const { benefit2, benefit3, benefit4, benefit5, benefit6 } =
          this.parent;

        const isValid = (val?: string) =>
          val && val.trim() !== "" && val.trim().toLowerCase() !== "nill";

        const hasAnyValid = [
          value,
          benefit2,
          benefit3,
          benefit4,
          benefit5,
          benefit6,
        ].some((b) => isValid(b));

        return hasAnyValid;
      }
    )
    .test("unique-benefits", "All benefits must be unique", function (value) {
      const { benefit2, benefit3, benefit4, benefit5, benefit6 } = this.parent;

      const benefits = [value, benefit2, benefit3, benefit4, benefit5, benefit6]
        .map((b) => b?.trim().toLowerCase())
        .filter(Boolean);

      const unique = new Set(benefits);
      return unique.size === benefits.length;
    }),

  benefit2: yup.string().default(""),
  benefit3: yup.string().default(""),
  benefit4: yup.string().default(""),
  benefit5: yup.string().default(""),
  benefit6: yup.string().default(""),
});
