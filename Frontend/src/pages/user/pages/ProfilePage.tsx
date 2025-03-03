import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import DetailsForm from "@/components/forms/DetailsForm";
import { verifyUserProfile } from "@/hooks/useForm";
import { validateProfileSchema } from "@/validation/userDetailsSchema";
import { useEffect, useState } from "react";
import { verifyUserProfileSchemaType } from "../../../../../types/user";
import { useUpdateUserProfile, useUserProfile } from "@/hooks/useUserProfile";
import ProfileImageUploader from "@/components/ProfileImageUploader";
import { Spinner } from "@/components/ui/spinner";

const initialValue = {
  avatar: "",
  firstName: "",
  userName: "",
  gender: "",
  country: "",
  description: "",
  mobileNumber: "",
  email: "",
};
export default function ProfilePage() {
  const [formData, setFormData] =
    useState<verifyUserProfileSchemaType>(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = verifyUserProfile({
    schema: validateProfileSchema,
    defaultValues: {
      firstName: "",
      userName: "",
      country: "",
      gender: "",
      description: "",
      mobileNumber: "",
    },
  });

  const { data: user, isPending: fetchIsPending } = useUserProfile();

  useEffect(() => {
    if (user?.userDetails) {
      setFormData(user.userDetails);
      reset(user.userDetails);
    }
  }, [user?.userDetails]);

  const { updateMutation, isPending } = useUpdateUserProfile(setIsEditing);

  const onsubmit = (data: verifyUserProfileSchemaType) => {
    console.log(data);
    updateMutation(data);
  };

  const handleIsEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const handleImageUpdate = (imageUrl: string | undefined) => {
    setFormData({ ...formData, avatar: imageUrl });
  };

  return (
    <div className="min-h-screen w-full bg-white mt-10 ">
      {fetchIsPending || (isPending && <Spinner />)}
      <div className=" pt-16">
        <main className=" p-8">
          <div className="max-full ">
            <div className="mb-8 flex flex-col md:flex-row w-full justify-between md:justify-normal md:gap-5 align-middle h-fit">
              <Button className="bg-amber-500 cursor-pointer hover:bg-amber-600 text-white mb-2 w-fit">
                Check in
              </Button>
              <p className="text-sm text-gray-600">
                Check in daily to maintain your streak and stay on the
                leaderboard!
                <br />
                Keep your progress going and secure your top spot.
              </p>
            </div>

            <div className="relative mb-8 ">
              <Button
                onClick={handleIsEditing}
                variant="secondary"
                size="sm"
                className="absolute right-0 md:right-60 top-0 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-300"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <div className="flex  gap-4 mb-6">
                <ProfileImageUploader
                  isEditing={isEditing}
                  onImageChange={handleImageUpdate}
                />
                <div>
                  <h2 className="text-xl  font-semibold">
                    {formData.firstName || "no Name"}
                  </h2>
                  <p className="text-gray-600">
                    {formData.email || "noName@gmail.com"}
                  </p>
                </div>
              </div>

              <DetailsForm
                isEditing={isEditing}
                formData={formData}
                register={register}
                errors={errors}
                isPending={isPending}
                onSubmit={handleSubmit(onsubmit)}
                submitButtonText="Submit"
                fields={[
                  [
                    {
                      name: "firstName",
                      label: "First Name",
                      type: "text",
                      placeholder: "Enter first name",
                      setValue,
                    },
                    {
                      name: "gender",
                      label: "Gender",
                      type: "select",
                      options: [
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" },
                      ],
                      setValue,
                      defaultValue: "Male",
                    },
                    {
                      name: "mobileNumber",
                      label: "Mobile",
                      type: "text",
                      placeholder: "Mobile  number",
                      setValue,
                    },
                  ],
                  [
                    {
                      name: "userName",
                      label: "User Name",
                      type: "text",
                      placeholder: "Enter user name",
                      setValue,
                    },
                    {
                      name: "country",
                      label: "Contry",
                      type: "text",
                      placeholder: "Where you from",
                      setValue,
                    },
                    {
                      name: "description",
                      label: "Description",
                      type: "textarea",
                      placeholder: "Tell us about yourself...",
                      setValue,
                    },
                  ],
                ]}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
