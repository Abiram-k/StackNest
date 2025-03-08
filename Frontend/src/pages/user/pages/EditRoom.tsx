import DetailsForm from "@/components/forms/DetailsForm";
import { useVerifyRoomForm } from "@/hooks/validation/useRoomForm";
import { validateRoomSchema } from "@/validation/roomSchema";
import { ArrowLeft } from "lucide-react";
import { RoomSchema } from "../../../../../types/user";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { useUpdateRoom } from "@/hooks/room/useUpdateRoom";
import { data, useNavigate, useParams, useRouteError } from "react-router-dom";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { useFetchSelectedRoom } from "@/hooks/room/userFetchSelectedRoom";
import { useEffect } from "react";

export default function EditRoom() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useVerifyRoomForm({
    schema: validateRoomSchema,
    defaultValues: {
      scheduledAt: undefined,
      description: "",
      isPremium: "No",
      isPrivate: "No",
      limit: 0,
      password: "",
      title: "",
    },
  });

  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    toast.success("Room ID is missing!");
    return;
  }

  const { data: selectedRoom, isPending: isGetRoomPeding } =
    useFetchSelectedRoom("users",roomId);
    console.log(selectedRoom)

  useEffect(() => {
    reset(selectedRoom?.room);
  }, [selectedRoom?.room]);

  const { mutate, isPending: isUpdateRoomPending } = useUpdateRoom();

  const onSubmit = (data: RoomSchema) => {
    mutate({ id: roomId, data });
  };

  return (
    <div className="min-h-screen bg-white ">
      {(isGetRoomPeding || isUpdateRoomPending) && <Spinner />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-50 rounded-3xl p-8">
          <button
            className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
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
                  type: "text",
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
              ],
            ]}
          />
        </div>
      </div>
    </div>
  );
}
