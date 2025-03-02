import { UseFormSetValue } from "react-hook-form";
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import { errorText } from "../ui/errorText";
import { verifyUserProfileSchemaType } from "../../../../types/user";

interface FormField {
  name: keyof verifyUserProfileSchemaType;
  label: string;
  type: "text" | "select" | "multi-select" | "textarea" | "email" | "tel";
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  setValue: UseFormSetValue<verifyUserProfileSchemaType>;
}

interface DetailsFormProps {
  fields: FormField[][]; // Array of columns with fields
  register: any;
  errors: any;
  isPending?: boolean;
  // setValue:any;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText?: string;
  isEditing: boolean;
  formData: verifyUserProfileSchemaType;
}

const DetailsForm = ({
  formData,
  isEditing,
  fields,
  register,
  onSubmit,
  errors,
  isPending,
  submitButtonText = "Update Profile",
}: DetailsFormProps) => {
  const renderField = (field: FormField) => {
    switch (field.type) {
      case "select":
        return (
          // <select
          //   id="gender"
          //   {...register(field.name)}
          //   onChange={(e) => field.setValue(field.name, e.target.value)}
          //   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus-visible:border-gray-200 focus:border-primary-500 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-300"
          //   defaultValue={formData.gender}
          //   disabled={!isEditing}
          // >
          //   <option value="">Select Gender</option>
          //   {field.options?.map((option) => (
          //     <option key={option.value} value={option.value}>
          //       {option.value}
          //     </option>
          //   ))}
          // </select>
          <div className="relative w-full">
  <select
    id="gender"
    {...register(field.name)}
    onChange={(e) => field.setValue(field.name, e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
               focus:outline-none focus:ring-1 focus-visible:border-gray-200 
               focus:border-primary-500 bg-white dark:bg-gray-900 dark:text-white 
               dark:border-gray-300 appearance-none relative"
    defaultValue={formData.gender}
    disabled={!isEditing}
  >
    <option value="">Select Gender</option>
    {field.options?.map((option) => (
      <option key={option.value} value={option.value}>
        {option.value}
      </option>
    ))}
  </select>
  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-gray-500 dark:text-gray-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </div>
</div>

        );

      case "textarea":
        return (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus-visible:border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-300"
            placeholder={field.placeholder}
            {...register(field.name)}
          />
        );

      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name)}
          />
        );
    }
  };

  return (
    <div className="relative mb-8 max-w-4xl">
      <form onSubmit={onSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          {fields.map((column, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {column.map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium mb-2 block">
                    {field.label}
                  </label>
                  {renderField(field)}
                  {errorText(errors, field.name)}
                </div>
              ))}
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="mt-8 flex justify-start">
            <Button
              type="submit"
              className="w-full md:w-auto bg-primary-500 dark:bg-primary-600"
            >
              {isPending ? submitButtonText + "..." : submitButtonText}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DetailsForm;
