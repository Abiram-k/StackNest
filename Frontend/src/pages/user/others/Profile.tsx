import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import DetailsForm from "@/components/DetailsForm";
import {  verifyUserProfile } from "@/hooks/useForm";
import { validateProfileSchema } from "@/validation/schema";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/api/user/userapi";

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    setValue,
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

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserProfile,
  });

  console.log("ERROR FROM BACKEND", error);
  console.log("DATA FROM BACKEND", user);
  const onsubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen w-full bg-white ">
      <div className=" pt-16">
        <main className=" p-8">
          <div className="max-full ">
            {/* Check-in Section */}
            <div className="mb-8">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white mb-2">
                Check in
              </Button>
              <p className="text-sm text-gray-600">
                Check in daily to maintain your streak and stay on the
                leaderboard!
                <br />
                Keep your progress going and secure your top spot.
              </p>
            </div>

            {/* Profile Section */}

            <div className="relative mb-8 ">
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-0  md:right-60 top-0"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile%20page-bnUhjDgqGaHbT5sgsn21mQ2fqufpce.png"
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">Alexa Rawles</h2>
                  <p className="text-gray-600">alexarawles@gmail.com</p>
                </div>
              </div>

              <DetailsForm
                register={register}
                errors={errors}
                isPending={isLoading}
                onSubmit={handleSubmit(onsubmit)}
                submitButtonText="Save Changes"
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
