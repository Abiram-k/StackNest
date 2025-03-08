import heroSectionImage from "../../assets/heroSection.png";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 pt-8 pb-16 ">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Unlock the Power of Developer Connection
        </h1>
        <div className="flex justify-center mt-6">
          <svg
            className=" h-5 text-primary animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 9l7 7 7-7"
            />
          </svg>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[350px] rounded-2xl overflow-hidden shadow-xl">
          <img
            src={heroSectionImage}
            alt="Developers collaborating"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        {/* Content on Right */}
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent">
            Make Moments Memorable
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Connect with developers worldwide through curated tech events,
            coding challenges, and collaborative projects. Expand your network
            and enhance your skills in our vibrant developer community.
          </p>

          <div className="flex justify-center gap-8 md:justify-start">
            <div className="text-center p-4  bg-primary-500 text-white dark:bg-primary-600  rounded-lg">
              <div className="text-2xl font-bold ">2k+</div>
              <div className="text-sm ">Tech Events Hosted</div>
            </div>
            <div className="text-center p-4 bg-primary-500 text-white dark:bg-primary-600 rounded-lg ">
              <div className="text-2xl font-bold ">10K+</div>
              <div className="text-sm ">Active Developers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
