import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Edit2,
  Flame,
  MessageCircle,
  X,
  Zap,
} from "lucide-react";
import DetailsForm from "@/components/forms/DetailsForm";
import { verifyUserProfile } from "@/hooks/validation/useProfileForm";
import { validateProfileSchema } from "@/validation/userDetailsSchema";
import { useEffect, useRef, useState } from "react";
import { verifyUserProfileSchemaType } from "../../../../../types/user";
import {
  useUpdateUserProfile,
  useUserProfile,
} from "@/hooks/user/userProfile/useUserProfile";
import ProfileImageUploader from "@/components/ImageUploader";
import { Spinner } from "@/components/ui/spinner";
import { ImageService } from "@/api/public/imageService";
import ChatBot from "./ChatBot";
import { HttpService } from "@/api/httpService";
import { useCheckin } from "@/hooks/user/userProfile/useCheckin";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialValue = {
  avatar: "",
  firstName: "",
  userName: "",
  gender: "",
  country: "",
  description: "",
  mobileNumber: "",
  email: "",
  streak: 0,
  streakClaimDate: new Date(),
  isVerified: false,
  isChatBotAuthorise: false,
};
const getDaysDifference = (from: Date, to: Date): number => {
  const startDate = new Date(from);
  const endDate = new Date(to);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  const timeDifferenceMs = Math.abs(endDate.getTime() - startDate.getTime());
  const daysDifference = Math.ceil(timeDifferenceMs / (1000 * 60 * 60 * 24));
  return daysDifference;
};

export default function ProfilePage() {
  const [formData, setFormData] =
    useState<verifyUserProfileSchemaType>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const selectedAvatar = useRef<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [isChatBotAuthorised, setIsChatBotAuthorised] = useState(false);
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = verifyUserProfile({
    schema: validateProfileSchema,
    defaultValues: {
      avatar: "",
      firstName: "",
      userName: "",
      country: "",
      gender: "",
      description: "",
      mobileNumber: "",
    },
  });

  const { data: user, isPending: fetchIsPending } = useUserProfile();
  const { mutate: checkinMutate, isPending: isCheckedInPending } = useCheckin(
    streak,
    setStreak
  );

  useEffect(() => {
    if (user?.userDetails) {
      setFormData(user.userDetails);
      if (user.userDetails.streak) setStreak(user.userDetails.streak);
      if (user.userDetails.isChatBotAuthorise) setIsChatBotAuthorised(true);
      reset(user.userDetails);
    }
  }, [user?.userDetails, streak]);

  const { updateMutation, isPending } = useUpdateUserProfile(setIsEditing);

  const handleCheckin = () => {
    checkinMutate();
    navigate("/user/home");
  };

  const onsubmit = async (data: verifyUserProfileSchemaType) => {
    try {
      setIsLoading(true);
      if (selectedAvatar.current) {
        const httpService = new HttpService();
        const imageService = new ImageService(httpService);
        // Requesting for cloudinary credentials from backend
        const credentials = await imageService.getCloudinaryCredentials();

        if (
          !credentials?.signature ||
          !credentials?.timestamp ||
          !credentials?.apiKey ||
          !credentials?.cloudName
        ) {
          toast.dismiss();
          toast.error("Missing Cloudinary credentials");
          return;
        }

        // post request to cloudinary signed uploads
        const cloudinaryImgURL = await imageService.uploadImage(
          selectedAvatar.current,
          "stackNest",
          credentials.cloudName,
          credentials.apiKey,
          credentials.signature,
          credentials.timestamp
        );
        // setValue("avatar", cloudinaryImgURL);
        if (cloudinaryImgURL) data.avatar = cloudinaryImgURL;
      }
      updateMutation(data);
    } catch (error) {
      alert(error);
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleIsEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const handleImageUpdate = (file: File) => {
    selectedAvatar.current = file;
  };

  return (
    <div className="min-h-screen w-full bg-white  dark:bg-transparent">
      {(isLoading || fetchIsPending || isPending || isCheckedInPending) && (
        <Spinner />
      )}
      <div className=" ">
        <main className=" p-8">
          <div className="max-full ">
            <div className="mb-8 flex flex-col md:flex-row w-full justify-between md:justify-normal md:gap-5 align-middle h-fit">
              {getDaysDifference(
                user?.userDetails.streakClaimDate as Date,
                new Date()
              ) === 0 ? (
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Current Streak: {streak} days
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 w-3/4">
                  <Button
                    onClick={handleCheckin}
                    className="bg-gradient-to-br from-amber-500  to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white mb-2 w-full group transition-all hover:shadow-lg hover:scale-[1.02] dark:bg-orange-900"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-white group-hover:animate-pulse" />
                      <span>Check In Now</span>
                    </div>
                  </Button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      Daily Challenge:
                    </span>{" "}
                    Maintain your streak to unlock exclusive rewards and stay
                    atop the leaderboard!
                  </p>
                </div>
              )}
            </div>

            <div className="relative mb-8 ">
              <Button
                onClick={handleIsEditing}
                variant="secondary"
                size="sm"
                className="absolute right-0 md:right-60 top-0 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-primary-50/90 bg-primary-500 text-white dark:hover:bg-primary-500/90 dark:bg-primary-600 dark:text-gray-200"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <div className="flex  gap-4 mb-6">
                {formData.isVerified && (
                  <p className="text-blue-600 text-2xl">Premium User</p>
                )}
                <ProfileImageUploader
                  defaultAvatar="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  fallbackText="Profile Image"
                  avatar={formData.avatar}
                  isEditing={isEditing}
                  onImageChange={handleImageUpdate}
                  avatarClass="w-12 h-12"
                  containerClass="flex flex-col items-center"
                  inputClass="mt-2 text-xs text-gray-500 w-20  bg-gray-200 p-1 rounded"
                />

                <div>
                  <h2 className="text-xl  font-semibold ">
                    {formData.firstName || "no Name"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-500">
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
            <div className="fixed bottom-10 right-10 md:bottom-20 md:right-20">
              {isChatBotOpen && (
                <ChatBot
                  setIsOpen={setIsChatBotOpen}
                  avatar={formData.avatar}
                />
              )}
              {isChatBotAuthorised && (
                <Button
                  onClick={() => setIsChatBotOpen(!isChatBotOpen)}
                  className={`rounded-full p-3 w-12 h-12 fixed bottom-10 right-10 md:bottom-20 md:right-20 ${
                    isChatBotOpen
                      ? "bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600"
                      : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-white "
                  }`}
                >
                  {isChatBotOpen ? (
                    <X size={26} />
                  ) : (
                    <MessageCircle size={27} />
                  )}{" "}
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
