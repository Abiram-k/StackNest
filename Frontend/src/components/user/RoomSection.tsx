import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import sampleImage from '../../assets/roomImage.png'

const RoomSection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Trending Rooms */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Trending Rooms</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <Card key={item} className="p-4">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={sampleImage}
                    alt="Event"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h4 className="font-bold mb-2">Let you go insane</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <Button className="bg-primary-500 text-white hover:bg-primary-500/90 dark:bg-primary-600">
                  Join Now
                </Button>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="link"
              className="text-primary-500 dark:text-primary-600"
            >
              Explore <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-6">General Room</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <Card key={item} className="p-4 bg-yellow-100">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={sampleImage}
                    alt="General community"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h4 className="font-bold mb-2">General Community</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <Button className="bg-primary-500 text-white hover:bg-primary-500/90 dark:bg-primary-600">
                  Join Now
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomSection;
