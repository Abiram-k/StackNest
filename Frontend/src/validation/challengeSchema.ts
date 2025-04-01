import { toast } from "sonner";
import * as yup from "yup";

const validateUniqueOptions = (options: any, context: any) => {
  const optionValues = [
    options.option1,
    options.option2,
    options.option3,
    options.option4,
  ];
  const uniqueOptions = new Set(optionValues);
  if (uniqueOptions.size !== 4) {
    toast.error("All 4 options should be unique");
    return context.createError({
      path: "option1",
      message: "Options should be unique",
    });
  }
  return true;
};

export const validateChallengeSchema = yup
  .object()
  .shape({
    questionNo: yup
      .number()
      .required("Question number is required*")
      .min(1, "Question number should start from 1"),

    question: yup.string().required("Question is required"),

    option1: yup.string().required("Option 1 is required"),

    option2: yup.string().required("Option 2 is required"),

    option3: yup.string().required("Option 3 is required"),

    option4: yup.string().required("Option 4 is required"),

    answer: yup
      .string()
      .oneOf(
        [
          yup.ref("option1"),
          yup.ref("option2"),
          yup.ref("option3"),
          yup.ref("option4"),
        ],
        "Answer must match one of the provided options"
      )
      .required("Answer is required"),
  })
  .test("option1", "Options should be unique", (values) => {
    return validateUniqueOptions(values, this);
  });
