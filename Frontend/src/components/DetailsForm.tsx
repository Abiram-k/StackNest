import { UseFormReturn, UseFormSetValue, useForm } from "react-hook-form";
import { Edit2, Mail, Phone } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { errorText } from "./ui/errorText";
import { verifyUserProfileSchemaType } from "../../../types/user";
// import { MultiSelect } from "./ui/multi-select"; // Assume you have/create this component

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
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText?: string;
}

const DetailsForm = ({
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
          //           <Select
          //           claName="z-50"
          //             {...register(field.name)}
          //             onValueChange={(value) => field.setValue(field.name, value)}
          //             defaultValue={field.defaultValue}
          // >
          //             <SelectTrigger>
          //               <SelectValue placeholder={field.placeholder} />
          //             </SelectTrigger>
          //             <SelectContent>
          //               {field.options?.map((option) => (
          //                 <SelectItem key={option.value} value={option.value}>
          //                   {option.label}
          //                 </SelectItem>
          //               ))}
          //             </SelectContent>
          //           </Select>

          <select
            id="gender"
            {...register(field.name)}
            onChange={(e) => field.setValue(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus-visible:border-gray-200 focus:border-primary-500 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-300"
          >
            <option value="">Select Gender</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
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

        <div className="mt-8 flex justify-start">
          <Button
            type="submit"
            className="w-full md:w-auto bg-primary-500 dark:bg-primary-600"
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DetailsForm;
