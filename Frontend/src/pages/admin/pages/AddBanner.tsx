import DetailsForm from "@/components/forms/DetailsForm";
import ImageUploader from "@/components/ImageUploader";
import { Spinner } from "@/components/ui/spinner";
import { useAddBanner } from "@/hooks/admin/bannerManagement/useAddBanner";
import { useVerifyBannerForm } from "@/hooks/validation/useBannerForm";
import { BannerRes } from "@/types";
import { validateBannerSchema } from "@/validation/bannerSchema";
import { useRef } from "react";

const AddBanner = () => {
  const selectedBanner = useRef<File | null>(null);

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

  const handleAddBanner = (data: BannerRes) => {
    // mutate(data);
  };

  const handleImageChange = (file: File) => {
    selectedBanner.current = file;
  };

  return (
    <div className="flex h-screen dark:bg-black">
      {isPending && <Spinner />}
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
          </div>

          <div className="md:ms-14 lg:ms-18 ">
            <DetailsForm
              isEditing={true}
              register={register}
              onSubmit={handleSubmit(handleAddBanner)}
              errors={errors}
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
