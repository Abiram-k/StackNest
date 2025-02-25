import { FieldErrors } from "react-hook-form";

export const errorText = (errors: FieldErrors, fieldName: string) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm">
        {errors[fieldName]?.message as string}
      </p>
    ) : null;
  };