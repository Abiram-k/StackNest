import { HttpService } from "@/api/httpService";
import { ImageService } from "@/api/public/imageService";
import DetailsForm from "@/components/forms/DetailsForm";
import ImageUploader from "@/components/ImageUploader";
import { Spinner } from "@/components/ui/spinner";
import { useAddBanner } from "@/hooks/admin/bannerManagement/useAddBanner";
import { useVerifyBannerForm } from "@/hooks/validation/useBannerForm";
import { BannerReq } from "@/types";
import { validateBannerSchema } from "@/validation/bannerSchema";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddBanner = () => {
  const selectedBanner = useRef<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useVerifyBannerForm({
    schema: validateBannerSchema,
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });

  const { mutate, isPending } = useAddBanner();
  const navigate = useNavigate();

  const handleAddBanner = async (data: BannerReq) => {
    try {
      setIsLoading(true);
      if (selectedBanner.current) {
        setImageError("");
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
          selectedBanner.current,
          "stackNest",
          credentials.cloudName,
          credentials.apiKey,
          credentials.signature,
          credentials.timestamp
        );
        setValue("image", cloudinaryImgURL);
        mutate({ ...data, image: cloudinaryImgURL });
        reset();
        selectedBanner.current = null;
        navigate(-1);
      } else {
        setImageError("Image is required");
      }
    } catch (error) {
      toast.error("Error occured while adding banner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (file: File) => {
    selectedBanner.current = file;
  };

  
  return (
    <div className="flex h-screen dark:bg-black">
      {(isPending || isLoading) && <Spinner />}
      <main className="flex-1 p-8  w-full">
        <h1 className="text-2xl font-bold mb-8">Add New Banner </h1>
        <div className="w-full flex flex-col justify-between p-10 shadow-md rounded">
          <div className="flex flex-col gap-2  h-fit px-10 mb-2 md:mb-5 md:ms-14 lg:ms-18 rounded-lg ">
            <p className="text-sm font-medium mb-2 block text-black">Banner:</p>
            <ImageUploader
              avatar=""
              defaultAvatar="https://placehold.co/2000x450"
              isEditing={true}
              onImageChange={handleImageChange}
              containerClass="border-2 border-dashed border-gray-300 hover:border-blue-500 relative w-full md:w-3/4 h-46 rounded-lg overflow-hidden group transition duration-300 ease-in-out"
              avatarClass="w-full h-full object-cover rounded-none"
              inputClass="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              fallbackText="Banner image"
            />
            {imageError && <p className="text-red-600 ">{imageError}</p>}
          </div>

          <div className="md:ms-14 lg:ms-18 ">
            <DetailsForm
              isEditing={true}
              register={register}
              onSubmit={handleSubmit(handleAddBanner)}
              errors={errors}
              submitButtonText="Submit"
              fields={[
                [
                  {
                    name: "title",
                    label: "Title",
                    type: "text",
                    placeholder: "Enter Banner Title",
                    setValue,
                  },
                ],
                [
                  {
                    name: "description",
                    label: "Description",
                    type: "text",
                    placeholder: "Enter Banner Description",
                    setValue,
                  },
                ],
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddBanner;
