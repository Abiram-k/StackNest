import { useFetchUserBanners } from "@/hooks/user/banner/useFetchUserBanners";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const BannerSection = () => {
  const { data } = useFetchUserBanners();

  return (
    <section className="w-full px-4 py-12">
      <Carousel className="w-full relative" opts={{ loop: true }}>
        <CarouselContent>
          {data?.banners.map((banner, index) => (
            <CarouselItem key={index} className="w-full">
              <div className="group relative h-[500px] rounded-lg overflow-hidden">
                <div className="relative h-full w-full">
                  <img
                    src={banner.image}
                    alt="Conference"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <div className="text-white space-y-2">
                  <h3 className="text-2xl font-bold">{banner.title}</h3>
                    <p className="text-lg">{banner.description}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="left-4 h-12 w-12 dark:bg-white/90"
          variant="default"
        />
        <CarouselNext
          className="right-4 h-12 w-12 dark:bg-white/90"
          variant="default"
        />
      </Carousel>
    </section>
  );
};

export default BannerSection;
