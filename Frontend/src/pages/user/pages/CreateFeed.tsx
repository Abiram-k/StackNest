import { HttpService } from "@/api/httpService";
import { ImageService } from "@/api/public/imageService";
import DetailsForm from "@/components/forms/DetailsForm";
import ImageUploader from "@/components/ImageUploader";
import { Spinner } from "@/components/ui/spinner";
import { usePostNewFeed } from "@/hooks/feeds/usePostNewFeed";
import { useVerifyFeedForm } from "@/hooks/validation/useFeedForm";
import { FeedReqType } from "@/types";
import { validateFeedSchema } from "@/validation/feedSchema";
import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateFeed = () => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useVerifyFeedForm({
    schema: validateFeedSchema,
    defaultValues: {
      title: "",
      content: "",
      media: "",
      scheduledAt: null,
    },
  });
  const selectedImage = useRef<File | null>(null);
  const uploadedImgUrl = useRef<string | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { mutate, isPending } = usePostNewFeed();

  const handleAddPost = async (data: FeedReqType) => {
    try {
      setIsLoading(true);
      if (selectedImage.current) {
        const httpService = new HttpService();
        const imageService = new ImageService(httpService);
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
          selectedImage.current,
          "stackNest",
          credentials.cloudName,
          credentials.apiKey,
          credentials.signature,
          credentials.timestamp
        );
        setValue("media", cloudinaryImgURL);
        uploadedImgUrl.current = cloudinaryImgURL;
      }
      const formattedData = {
        media: uploadedImgUrl.current,
        title: data.title,
        content: data.content,
        scheduledAt: data.scheduledAt,
      };
      mutate(formattedData);
      reset();
      selectedImage.current = null;
      navigate(-1);
    } catch (error) {
      toast.error("Error occured while uploading post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (file: File) => {
    selectedImage.current = file;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black w-full md:-ms-72 mb-20">
      {(isLoading || isPending) && <Spinner />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-50 dark:bg-black rounded-3xl p-8">
          <button
            className="flex items-center text-gray-600 mb-6 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-400"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <h1 className="text-2xl font-semibold mb-2">Upload New Feed</h1>
          <p className="text-gray-600 mb-8">
            Share your quality thoughts with other developers, collaborate with
            them for your bright future.
          </p>

          <div className="">
            <div className="flex flex-col gap-2  h-fit px-10 mb-2 md:mb-5 md:ms-14 lg:ms-18 rounded-lg ">
              <p className="text-sm font-medium mb-2 block  text-black">
                Image:
              </p>
              <ImageUploader
                avatar=""
                defaultAvatar="https://placehold.co/1600x450"
                isEditing={true}
                onImageChange={handleImageChange}
                containerClass="border-2 md:-ms-10 border-dashed border-gray-300 hover:border-blue-500 relative w-full md:w-full h-46 rounded-lg overflow-hidden group transition duration-300 ease-in-out"
                avatarClass="w-full h-full object-cover rounded-none"
                inputClass="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                fallbackText="Banner image"
              />
            </div>
            <DetailsForm
              isEditing={true}
              errors={errors}
              submitButtonText="Post Now"
              onSubmit={handleSubmit(handleAddPost)}
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
                    name: "scheduledAt",
                    label: "Schedule At",
                    type: "date",
                    placeholder: "Select Date",
                    setValue,
                  },
                ],
                [
                  {
                    name: "content",
                    label: "Content",
                    type: "text",
                    placeholder: "Enter Content",
                    setValue,
                  },
                ],
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFeed;
