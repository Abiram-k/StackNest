import {
  ArrowRight,
  Calendar,
  DoorOpen,
  LayoutList,
  Plus,
  User,
  Users,
} from "lucide-react";
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
        <div className="col-span-1">
          <h3 className="text-2xl font-bold mb-6">General Room</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-14">
            {data?.rooms?.length ? (
              data.rooms
                .filter((room) => room.roomType === "general")
                .map((room) => (
                  <div
                    key={room.roomId}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out overflow-hidden"
                  >
                    <div className="p-6 flex flex-col gap-4">
                      {/* Room Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {room.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                          <Users className="w-4 h-4 text-blue-600 dark:text-blue-200" />
                          <span className="text-blue-600 dark:text-blue-200">
                            {room.participants?.length || 0}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span>Host: {"Community Host"}</span>
                        </div>

                        {room.scheduledAt && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date().toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {room.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {room.description}
                        </p>
                      )}

                      <button
                        onClick={() =>
                          handleEnterRoom("", room.isPrivate, room.roomId)
                        }
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-500/90 dark:bg-primary-600 dark:hover:bg-primary-600/90 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Join Community
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
                  <LayoutList className="w-12 h-12" />
                  <p className="text-lg">No general rooms available</p>
                  <p className="text-sm">
                    New rooms will appear here when created
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trending Rooms */}
        <div className="col-span-1">
          <h3 className="text-2xl font-bold mb-6">Trending Rooms</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2  gap-4">
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
      </div>
    </section>
  );
};

export default RoomSection;
