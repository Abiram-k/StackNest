import PasswordConfirmation from "@/components/modal/PasswordConfirmation";
import RoomCard from "@/components/card/RoomCard";
import { Spinner } from "@/components/ui/spinner";
import { useFetchFavorites } from "@/hooks/user/favorites/useFetchFavorites";
import { useRemoveFromFavorites } from "@/hooks/user/favorites/useRemoveFromFavorites";
import { useJoinRoom, useVerifyRoomPassword } from "@/hooks/room/useJoinRoom";
import { useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";

export default function Favourites() {
  const { data: favorites, isPending } = useFetchFavorites();

  const [isModalPasswordModal, setIsModalPasswordModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const { mutate: joinRoomMutate, isPending: joinIsPending } = useJoinRoom();

  const { mutate: verifyPasswordMutate, isPending: verifyingIsPending } =
    useVerifyRoomPassword(() => {
      setIsModalPasswordModal(false);
      joinRoomMutate(selectedRoomId);
    });

  const { mutate: removeMutation, isPending: isRemovingPending } =
    useRemoveFromFavorites();

  const handleEnterRoom = (type: string, isPrivate: string, roomId: string) => {
    setSelectedRoomId(roomId);
    if (isPrivate == "Yes" && type != "my-room") {
      setIsModalPasswordModal(true);
    } else {
      joinRoomMutate(roomId);
    }
  };

  const handleVerifyPassword = (password: string) => {
    if (!selectedRoomId) {
      toast.dismiss();
      toast.error("RoomId not found!");
      return;
    }
    verifyPasswordMutate({ roomId: selectedRoomId, password });
  };

  const handleRemove = (roomId: string) => {
    removeMutation(roomId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black px-2 md:px-10">
      {isModalPasswordModal && (
        <PasswordConfirmation
          onCancel={() => setIsModalPasswordModal(false)}
          onProceed={handleVerifyPassword}
        />
      )}
      {(isPending ||
        isRemovingPending ||
        joinIsPending ||
        verifyingIsPending) && <Spinner />}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Favourite Rooms</h1>

          {favorites?.rooms && favorites?.rooms?.length >= 5 && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-md animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <p className="text-sm font-medium">
                You’ve already added the maximum number of rooms to favorites!
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:mt-10">
          {favorites?.rooms && favorites?.rooms?.length > 0 ? (
            favorites.rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                type="favorites"
                handleEnterRoom={handleEnterRoom}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <div className="w-full col-span-full flex flex-col items-center justify-center gap-6 py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-500  dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M12 6a9 9 0 110 18 9 9 0 010-18z"
                />
              </svg>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  No rooms found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  There are currently no rooms were added. Add now !
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
