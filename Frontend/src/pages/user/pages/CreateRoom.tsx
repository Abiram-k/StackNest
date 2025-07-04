import DetailsForm from "@/components/forms/DetailsForm";
import { useVerifyRoomForm } from "@/hooks/validation/useRoomForm";
import { validateRoomSchema } from "@/validation/roomSchema";
import { ArrowLeft } from "lucide-react";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { useNavigate } from "react-router-dom";
import { RoomSchema } from "@/types";

export default function CreateRoom() {
  const {
    register,
    // reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useVerifyRoomForm({
    schema: validateRoomSchema,
    defaultValues: {
      // scheduledAt: new Date(),
      description: "",
      isPremium: "No",
      isPrivate: "No",
      limit: 0,
      password: "",
      title: "",
    },
  });
  const navigate = useNavigate();

  const { mutate } = useCreateRoom();

  const onSubmit = (data: RoomSchema) => {
    console.log(data);
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black ">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-50 dark:bg-black rounded-3xl p-8">
          <button
            className="flex items-center text-gray-600 mb-6 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-400"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <h1 className="text-2xl font-semibold mb-2">Create Custom Room</h1>
          <p className="text-gray-600 mb-8">
            Create a room to collaborate, learn, and have fun with fellow
            developers and friends! Share ideas, work on projects together, and
            enjoy quality time in a space designed for creativity and growth
          </p>

          <DetailsForm
            isEditing={true}
            errors={errors}
            submitButtonText="Create"
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            fields={[
              [
                {
                  name: "title",
                  label: "Title",
                  type: "text",
                  placeholder: "Enter Title",
                  setValue,
                },
                {
                  name: "limit",
                  label: "Limit",
                  type: "text",
                  placeholder: "Enter Limit",
                  setValue,
                },
                {
                  name: "isPrivate",
                  label: "isPrivate",
                  type: "select",
                  options: [
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ],
                  setValue,
                  defaultValue: "No",
                },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  placeholder: "Enter password",
                  setValue,
                },
              ],
              [
                {
                  name: "isPremium",
                  label: "isPremium",
                  type: "select",
                  options: [
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ],
                  setValue,
                  defaultValue: "No",
                },
                {
                  name: "description",
                  label: "Description",
                  type: "text",
                  placeholder: "Mobile  Descriptoin",
                  setValue,
                },
                // {
                //   name: "scheduledAt",
                //   label: "Schedule At",
                //   type: "date",
                //   placeholder: "Select Date",
                //   setValue,
                // },
              ],
            ]}
          />
        </div>
      </div>
    </div>
  );
}
