import { BannerRes } from "@/types";
import CustomTable from "@/components/CustomTable";
import { useFetchBanners } from "@/hooks/admin/bannerManagement/useFetchBanners";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import ConfirmationDialog from "@/components/modal/confirmationDialog";
import { useState } from "react";
import { useRemoveBanner } from "@/hooks/admin/bannerManagement/useRemoveBanner";
import { FallBackTable } from "@/components/FallBackTable";
import { toast } from "sonner";

const columns = [
  {
    key: "image" as keyof BannerRes,
    header: "Banner",
    render: (banner: BannerRes) => (
      <img
        src={
          banner.image ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        }
        alt="User Profile"
        width={50}
        className="rounded-full mx-auto"
      />
    ),
  },
  { key: "title" as keyof BannerRes, header: "Title" },
  { key: "description" as keyof BannerRes, header: "Description" },
];

export default function BannerManagement() {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [bannerId, setBannerId] = useState("");
  const navigate = useNavigate();

  const { data, isPending: fetchBannerPending } = useFetchBanners();

  const { mutate: removeBannerMutate, isPending: RemoveBannerPending } =
    useRemoveBanner();

  const handleEdit = (bannerId: string) => {
    navigate(`/admin/banner-management/${bannerId}/edit`);
  };

  const handleRemoveBanner = (bannerId: string) => {
    setBannerId(bannerId);
    setIsConfirmationOpen(true);
  };

  const handleConfirm = () => {
    removeBannerMutate(bannerId);
    setIsConfirmationOpen(false);
  };
  const handleCancel = () => {
    toast.success("Action Cancelled");
    setIsConfirmationOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black ">
      {(RemoveBannerPending || fetchBannerPending) && <Spinner />}
      {isConfirmationOpen && (
        <ConfirmationDialog
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          message={`Are you sure to remove this banner?`}
        />
      )}
      <main className="flex-1 p-8 ">
        <div className=" flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-8">Banner Management</h1>
          <Button
            className="bg-green-500 dark:bg-green-500 dark:hover:bg-green-500/90 text-white hover:bg-green-500/90 hover:text-white"
            variant={"outline"}
            onClick={() => navigate("/admin/banner-management/add")}
          >
            <Plus />
            Add new Banner
          </Button>
        </div>
        <div className=" mt-4 md:mt-8 lg:mt-12">
          {data?.banners?.length ? (
            <CustomTable
              onToggleAction={() => {}}
              data={data.banners}
              columns={columns}
              handleEdit={handleEdit}
              handleRemove={handleRemoveBanner}
            />
          ) : (
            <FallBackTable
              mainTitle="No Banners founded"
              subTitle="Add new banner now"
            />
          )}
        </div>
      </main>
    </div>
  );
}
