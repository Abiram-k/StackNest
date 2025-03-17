import { useFetchUserBanners } from "@/hooks/user/banner/useFetchUserBanners";
import banner from "../../assets/banner.png";
import { Spinner } from "../ui/spinner";

const BannerSection = () => {
  const { data, isPending } = useFetchUserBanners();
  console.log(data, "From user UI HOME");

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="group relative h-[500px] rounded-lg overflow-hidden">
        <div className="relative h-full w-full">
          <img
            src={data?.banners[0].image}
            alt="Conference"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <div className="text-white space-y-2">
            <h3 className="text-2xl font-bold">{data?.banners[0].title}</h3>
            <p className="text-lg">{data?.banners[0].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
