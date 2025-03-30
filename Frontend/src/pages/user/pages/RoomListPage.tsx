import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoomCard from "@/components/card/RoomCard";
import { useNavigate } from "react-router-dom";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { useFetchAllRooms, useFetchMyRooms } from "@/hooks/room/useFetchRooms";
import { useRemoveRoom } from "@/hooks/room/useRemoveRoom";
import ConfirmationDialog from "../../../components/modal/confirmationDialog";
import PasswordConfirmation from "@/components/modal/PasswordConfirmation";
import { useJoinRoom, useVerifyRoomPassword } from "@/hooks/room/useJoinRoom";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/optimizational/useDebounce";
import { useAddToFavorites } from "@/hooks/user/favorites/useAddToFavorites";
import { useRemoveFromFavorites } from "@/hooks/user/favorites/useRemoveFromFavorites";
import { useFetchFavorites } from "@/hooks/user/favorites/useFetchFavorites";
import { toast } from "sonner";

const delay = import.meta.env.VITE_DEBOUNCE_DELAY as number;

const filterOptions = [{ value: "Premium" }, { value: "Private" }];

export default function RoomsListPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const debounceSearchValue = useDebounce(search, delay);
  const [removeByRoomId, setRemoveByRoomId] = useState("");
  const [isModalPasswordModal, setIsModalPasswordModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const navigate = useNavigate();

  // to fetch my rooms
  const { data: myRooms, isPending: fetchMyRoomPending } = useFetchMyRooms();

  // to fetch all rooms except ours
  const { data: availableRooms, isPending: fetchAllRoomsPending } =
    useFetchAllRooms("users", {
      search: debounceSearchValue,
      sort,
      filter,
      currentPage,
      limit: 10,
    });


  // onClick of edit icon
  const handleEditRoom = (roomId: string) => {
    navigate(`/user/room/${roomId}/edit`);
  };

  // Backend call to remove room
  const { mutate: removeMutate } = useRemoveRoom();

  // After confirmation from confirmation modal
  const handleRemoveRoom = () => {
    removeMutate(removeByRoomId);
    setRemoveByRoomId("");
  };

  // hook to join room
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

  // fetch all of favorites
  const { data: favorites } = useFetchFavorites();

  // add-to-favorites mutate
  const { mutate: addToFavoritesMutate, isPending: addToFavoritesPending } =
    useAddToFavorites();

  //remove from favorties mutate
  const {
    mutate: removeFromFavoritesMutate,
    isPending: removeFromFavoritesPending,
  } = useRemoveFromFavorites();

  // onClick for password modal confirm
  const handleVerifyPassword = (password: string) => {
    if (!selectedRoomId) {
      toast.dismiss();
      toast.error("RoomId not found!");
      return;
    }
    verifyPasswordMutate({ roomId: selectedRoomId, password });
  };

  const handleAddToFavorites = (roomId: string) => {
    addToFavoritesMutate(roomId);
  };

  const handleRemoveFromFavorites = (roomId: string) => {
    removeFromFavoritesMutate(roomId);
  };

  return (
    <div className="min-h-screen ">
      {isModalPasswordModal && (
        <PasswordConfirmation
          onCancel={() => setIsModalPasswordModal(false)}
          onProceed={handleVerifyPassword}
        />
      )}

      {removeByRoomId && (
        <ConfirmationDialog
          onConfirm={handleRemoveRoom}
          onCancel={() => {
            toast.success("Action cancelled");
            setRemoveByRoomId("");
          }}
        />
      )}

      {(joinIsPending ||
        verifyingIsPending ||
        addToFavoritesPending ||
        removeFromFavoritesPending) && <Spinner />}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Rooms</h1>
            <Button
              className="bg-primary-500 dark:hover:bg-primary-500/90 dark:bg-primary-600 dark:text-gray-300  hover:bg-primary-600/90"
              onClick={() => navigate("/user/room/create")}
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Room
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myRooms?.rooms?.length ? (
              myRooms.rooms.map((room) => (
                <RoomCard
                  key={room.roomId}
                  room={room}
                  type="my-room"
                  onEdit={handleEditRoom}
                  onRemove={(value: string) => setRemoveByRoomId(value)}
                  handleEnterRoom={handleEnterRoom}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-10">
                <p className="text-lg font-semibold text-gray-500">
                  {fetchMyRoomPending
                    ? "Loading ..."
                    : "You're not created any rooms Yet. Create now!"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Available Rooms</h2>

            <FilterBar
              setSearchQuery={setSearch}
              setFilterQuery={setFilter}
              setSortedOrder={setSort}
              filterOptions={filterOptions}
              // sortOptions={sortOptions}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {availableRooms?.rooms?.length ? (
              availableRooms.rooms
                .filter((room) => room.roomType != "general")
                .map((room, i) => (               
                  <RoomCard
                    key={`${room.roomId}-${i}`}
                    room={room}
                    type="available"
                    handleEnterRoom={handleEnterRoom}
                    favorites={favorites?.rooms || []}
                    handleAddToFavorites={handleAddToFavorites}
                    handleRemoveFromFavorites={handleRemoveFromFavorites}
                  />
                ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-10">
                <p className="text-lg font-semibold text-gray-500">
                  {fetchAllRoomsPending ? "Loading ..." : "No rooms available"}
                </p>
              </div>
            )}
          </div>

          <Pagination
            totalPages={availableRooms?.totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
