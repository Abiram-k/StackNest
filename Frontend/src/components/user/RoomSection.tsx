import { ArrowRight, Cpu, DoorOpen, LayoutList } from "lucide-react";
import { useFetchAllRooms } from "@/hooks/room/useFetchRooms";
import {  useState } from "react";
import PasswordConfirmation from "../modal/PasswordConfirmation";
import { useJoinRoom, useVerifyRoomPassword } from "@/hooks/room/useJoinRoom";
import { Spinner } from "../ui/spinner";
import { Link } from "react-router-dom";
import RoomCard from "../card/RoomCard";
import { toast } from "sonner";

const RoomSection = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const [isModalPasswordModal, setIsModalPasswordModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const { data, isPending } = useFetchAllRooms("users", {
    search: "",
    sort: "",
    filter: "",
    currentPage: 1,
    limit: 7,
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
              <div className="relative group bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 rounded-xl shadow-2xl p-6 h-96 md:h-[340px] lg:h-[560px] xl:h-[460px]  border-2 border-transparent hover:border-cyan-400/30 transition-all overflow-hidden w-full">
                {/* Glowing overlay effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Binary code animation background */}
                <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGg2MDB2NjAwSDB6IiBmaWxsPSJub25lIi8+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMjAiIHg9IjEwIiB5PSI1MCIgZmlsbD0iIzQ0ZmZmZiIgb3BhY2l0eT0iMC4xIi8+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMTUiIHg9IjMwIiB5PSI3MCIgZmlsbD0iIzQ0ZmZmZiIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="bg-cyan-500/20 p-2 rounded-lg backdrop-blur-sm">
                    <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-cyan-100 drop-shadow-sm">
                    {generalRoom.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-8 line-clamp-4 text-sm leading-relaxed relative z-10">
                  {generalRoom.description}
                </p>

                {/* Participants */}
                <div className="mb-8 relative z-10">
                  <h4 className="text-sm font-semibold text-cyan-300 mb-3">
                    ACTIVE MEMBERS
                  </h4>
                  <div className="flex -space-x-2">
                    {generalRoom.participants.slice(0, 5).map((participant) => (
                      <img
                        key={participant.user.userName}
                        src={participant.user.avatar}
                        alt={participant.user.userName}
                        className="w-8 h-8 rounded-full border-2 border-cyan-400/30 hover:border-cyan-400 transition-all shadow-lg"
                      />
                    ))}
                    {generalRoom.participants.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-cyan-900/50 border-2 border-cyan-400/30 flex items-center justify-center text-xs text-cyan-300">
                        +{generalRoom.participants.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Join Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-indigo-900/90 to-transparent rounded-xl z-20">
                  <button
                    onClick={() =>
                      handleEnterRoom("general", "NO", generalRoom.roomId)
                    }
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-cyan-400/20 hover:scale-[1.02]"
                  >
                    <DoorOpen className="w-5 h-5" />
                    <span className="bg-gradient-to-r from-white/90 to-white bg-clip-text text-transparent">
                      Join Hub
                    </span>
                  </button>
                </div>

                {/* Floating Tech Elements */}
                <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                  <svg
                    className="w-24 h-24 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M8 16l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
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
              data.rooms
                .filter((room) => room.roomType !== "general")
                .slice(0, 6)
                .map((room, i) => (
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
              className="text-center mt-3 font-semibold text-primary-500 dark:text-primary-600 hover:border-b border-primary-500 cursor-pointer inline-flex items-center gap-1"
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
