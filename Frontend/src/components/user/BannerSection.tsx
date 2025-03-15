import banner from "../../assets/banner.png";

const BannerSection = () => {


  
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="group relative h-[500px] rounded-lg overflow-hidden">

        <div className="relative h-full w-full">
          <img
            src={banner}
            alt="Conference"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <div className="text-white space-y-2">
            <h3 className="text-2xl font-bold">Conference Meeting</h3>
            <p className="text-lg">
              Join our annual conference with world-class speakers and
              networking opportunities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
