import roomImage from "../assets/roomImage.png";
import { Button } from "./ui/button";

const CreateRoomSection = () => {
  return (
    <section className="container mx-auto px-4 py-12  relative">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 bg-card-bg-500 dark:text-white dark:bg-card-bg-600">
        <div className="relative w-full md:w-1/2 flex justify-center">
          <img
            src={roomImage}
            alt="Virtual space illustration"
            className="object-contain max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl top-[-25px] relative"
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">Make Your Virtual Space</h2>
          <p className="text-gray-600 mb-6">
            Connect, collaborate, and create in your own virtual space.
          </p>
          <Button className="cursor-pointer bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-500/90 mb-2">
            Create Room
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CreateRoomSection;
