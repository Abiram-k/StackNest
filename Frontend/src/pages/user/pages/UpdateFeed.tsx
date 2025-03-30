import { HttpService } from "@/api/httpService";
import { ImageService } from "@/api/public/imageService";
import DetailsForm from "@/components/forms/DetailsForm";
import ImageUploader from "@/components/ImageUploader";
import { Spinner } from "@/components/ui/spinner";
import { useGetSelectedFeed } from "@/hooks/feeds/useGetSelectedFeed";
import { useUpdateFeed } from "@/hooks/feeds/useUpdateFeed";
import { useVerifyFeedForm } from "@/hooks/validation/useFeedForm";
import { FeedReqType } from "@/types";
import { validateFeedSchema } from "@/validation/feedSchema";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const UpdateFeed = () => {
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
  const [defaultMedia, setDefaultMedia] = useState("");
  const { feedId } = useParams<{ feedId: string }>();
  if (!feedId) {
    toast.error(`Feed id is missing: ${feedId}`);
    return;
  }

  const navigate = useNavigate();
  const { mutate: postUpdateMutate, isPending: updatePending } =
    useUpdateFeed();

  const { data: selectedFeedData, isPending } = useGetSelectedFeed(feedId);

  useEffect(() => {
    reset(selectedFeedData?.selectedFeed);
    setDefaultMedia(selectedFeedData?.selectedFeed.media || "");
  }, [selectedFeedData?.selectedFeed]);

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
        media: uploadedImgUrl.current || defaultMedia,
        title: data.title,
        content: data.content,
        scheduledAt: data.scheduledAt,
      };
      postUpdateMutate({ feedId, data: formattedData });
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
      {(isLoading || isPending || updatePending) && <Spinner />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-50 dark:bg-black rounded-3xl p-8">
          <button
            className="flex items-center text-gray-600 mb-6 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-400"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <h1 className="text-2xl font-semibold mb-2">Update Feed</h1>
          <p className="text-gray-600 mb-8">
            Share your quality thoughts with other developers, collaborate with
            them for your bright future.
          </p>

          <div className="">
            <div className="flex flex-col gap-2  h-fit px-10 mb-2 md:mb-5 md:ms-14 lg:ms-18 rounded-lg ">
              <p className="text-sm font-medium mb-2 block  text-black">
                Image / Video :
              </p>
              <ImageUploader
                isVideoAllowed={true}
                avatar=""
                defaultAvatar={defaultMedia || `https://placehold.co/1600x450`}
                isEditing={true}
                onImageChange={handleImageChange}
                containerClass="border-2 md:-ms-10 border-dashed border-gray-300 hover:border-blue-500 relative w-full md:w-full h-46 rounded-lg overflow-hidden group transition duration-300 ease-in-out"
                avatarClass="w-full h-full object-cover rounded-none"
                inputClass="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                fallbackText="Video Preview Unavailable !"
              />
            </div>
            <div className="w-full md:ms-50 mt-5">
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
                      name: "content",
                      label: "Content",
                      type: "textarea",
                      placeholder: "Enter Content",
                      setValue,
                    },
                  ],
                  [],
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateFeed;
