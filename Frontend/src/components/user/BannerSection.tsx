import banner from "../../assets/banner.png"

const BannerSection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
    <div className="relative h-[500px] rounded-lg overflow-hidden flex justify-center items-center">
      <img
        src={banner}
        alt="Conference"
        className="w-full h-full object-cover"
      />
    </div>
  </section>
  )
}

export default BannerSection
