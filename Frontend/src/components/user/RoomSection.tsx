import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import sampleImage from "../../assets/roomImage.png";
import { useNavigate } from "react-router-dom";
import { useFetchAllRooms } from "@/hooks/room/useFetchRooms";
import RoomCard from "../rooms/RoomCard";
import { useState } from "react";
import PasswordConfirmation from "../modal/PasswordConfirmation";
import { useJoinRoom, useVerifyRoomPassword } from "@/hooks/room/useJoinRoom";
import toast from "react-hot-toast";

const RoomSection = () => {
  const navigate = useNavigate();
  const [isModalPasswordModal, setIsModalPasswordModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const { data, isPending } = useFetchAllRooms("users", {
    search: "",
    sort: "",
    filter: "",
    currentPage: 1,
    limit: 4,
  });

  const { mutate: joinRoomMutate, isPending: joinIsPending } = useJoinRoom();

  // callback after clicking Enter <button>
  const handleEnterRoom = (type: string, isPrivate: string, roomId: string) => {
    setSelectedRoomId(roomId);
    if (isPrivate == "Yes" && type != "my-room") {
      setIsModalPasswordModal(true);
    } else {
      joinRoomMutate(roomId);
    }
  };

  // verify-password, callback were passed in hook, so it join when it is success
  const { mutate: verifyPasswordMutate, isPending: verifyingIsPending } =
    useVerifyRoomPassword(() => {
      setIsModalPasswordModal(false);
      joinRoomMutate(selectedRoomId);
    });

  const handleVerifyPassword = (password: string) => {
    if (!selectedRoomId) {
      toast.dismiss();
      toast.error("RoomId not found!");
      return;
    }
    verifyPasswordMutate({ roomId: selectedRoomId, password });
  };

  return (
    <section className="container mx-auto px-4 py-12">
      {isModalPasswordModal && (
        <PasswordConfirmation
          onCancel={() => setIsModalPasswordModal(false)}
          onProceed={handleVerifyPassword}
        />
      )}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Trending Rooms */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Trending Rooms</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            {data?.rooms?.length ? (
              data.rooms.map((room, i) => (
                <RoomCard
                  key={`${room.roomId}-${i}`}
                  room={room}
                  type="available"
                  handleEnterRoom={handleEnterRoom}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-10">
                <p className="text-lg font-semibold text-gray-500">
                  {isPending ? "Loading ..." : "No rooms available"}
                </p>
              </div>
            )}

            {/* {[1, 2].map((item) => (
              <Card key={item} className="p-4">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={sampleImage}
                    alt="Event"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h4 className="font-bold mb-2">Let you go insane</h4>
                <p className="text-sm text-gray-600 dark:text-gray-500 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <Button className="bg-primary-500 text-white hover:bg-primary-500/90 dark:hover:bg-primary-500/90 dark:bg-primary-600 dark:text-gray-300">
                  Join Now
                </Button>
              </Card>
            ))} */}
          </div>
          <div className="text-center mt-8">
            <Button
              onClick={() => navigate("/user/room")}
              variant="link"
              className="text-primary-500 dark:text-primary-600"
            >
              Explore <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div>
          {/* <h3 className="text-2xl font-bold mb-6">General Room</h3> */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-14">
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
                <p className="text-sm text-gray-600 dark:text-gray-500 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <Button className="bg-primary-500 text-white hover:bg-primary-500/90 dark:hover:bg-primary-500/90 dark:bg-primary-600 dark:text-gray-300">
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
