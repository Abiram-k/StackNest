import { BannerRes } from "@/types";
import CustomTable from "@/components/CustomTable";
import { useFetchBanners } from "@/hooks/admin/bannerManagement/useFetchBanners";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  //   const { data, isPending } = useFetchBanners();
  const navigate = useNavigate();
  const handleEdit = (bannerId: string) => {
    alert("Edit");
    alert(bannerId);
  };

  const handleRemoveBanner = (bannerId: string) => {
    alert("Remove");
    alert(bannerId);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      {/* {isPending && <Spinner />} */}
      <main className="flex-1 p-8">
        <Button
          variant={"outline"}
          onClick={() => navigate("/admin/banner-management/add")}
        >
          Add new Banner
        </Button>
        <h1 className="text-2xl font-bold mb-8">Banner Management</h1>
        {/* <CustomTable
          data={data}
          columns={columns}
          handleEdit={handleEdit}
          handleRemove={handleRemoveBanner}
        /> */}
      </main>
    </div>
  );
}
