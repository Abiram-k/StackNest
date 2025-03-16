import {
  ArrowRight,
  ArrowRightCircleIcon,
  Code,
  LayoutList,
} from "lucide-react";
import { useFetchAllRooms } from "@/hooks/room/useFetchRooms";
import RoomCard from "../rooms/RoomCard";
import { useState } from "react";
import PasswordConfirmation from "../modal/PasswordConfirmation";
import { useJoinRoom, useVerifyRoomPassword } from "@/hooks/room/useJoinRoom";
import toast from "react-hot-toast";
import { Spinner } from "../ui/spinner";
import { Link, useNavigate } from "react-router-dom";

const RoomSection = () => {
  const [isModalPasswordModal, setIsModalPasswordModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const navigate = useNavigate();
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
    if (isPrivate == "Yes" && type == "available") {
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
  const generalRoom = data?.rooms?.find((room) => room.roomType === "general");

  return (
    <section className="container mx-auto px-4 py-12">
      {isModalPasswordModal && (
        <PasswordConfirmation
          onCancel={() => setIsModalPasswordModal(false)}
          onProceed={handleVerifyPassword}
        />
      )}
      {(joinIsPending || verifyingIsPending) && <Spinner />}
      <div className="grid md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <h3 className="text-2xl font-bold mb-6">General Room</h3>
          <div>
            {generalRoom ? (
              <div className="relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 h-96 w-full border  border-gray-700/50 hover:border-blue-500 transition-all">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Code className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100">
                    {generalRoom.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-8 line-clamp-4 text-sm">
                  {generalRoom.description}
                </p>

                {/* Participants */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">
                    Active Members
                  </h4>
                  <div className="flex -space-x-2">
                    {generalRoom.participants.slice(0, 5).map((participant) => (
                      <img
                        key={participant.user.userName}
                        src={participant.user.avatar}
                        alt={participant.user.userName}
                        className="w-8 h-8 rounded-full border-2 border-gray-800 hover:border-blue-400 transition-all"
                      />
                    ))}
                    {generalRoom.participants.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-800/50 border-2 border-gray-800 flex items-center justify-center text-xs text-gray-400">
                        +{generalRoom.participants.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Join Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900/90 to-transparent rounded-xl">
                  <button
                    onClick={() =>
                      handleEnterRoom("general", "NO", generalRoom.roomId)
                    }
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowRightCircleIcon className="w-5 h-5" />
                    Join Community
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
                  <LayoutList className="w-12 h-12" />
                  <p className="text-lg">No general room available</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-3">
          <h3 className="text-2xl font-bold mb-6">Trending Rooms</h3>
          <div className="grid md:grid-cols-3 gap-4">
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
              <div className="col-span-full text-center py-12">
                <p className="text-lg font-semibold text-gray-500">
                  {isPending ? "Loading ..." : "No rooms available"}
                </p>
              </div>
            )}
          </div>
          <div className="text-center">
            <Link
              to={"/user/room"}
              className="text-center font-semibold text-primary-500 dark:text-primary-600 hover:border-b border-primary-500 cursor-pointer inline-flex items-center gap-1"
            >
              Explore <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomSection;
