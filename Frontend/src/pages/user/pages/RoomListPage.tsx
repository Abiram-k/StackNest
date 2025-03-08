import { useState } from "react";
import { Heading1, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoomCard from "@/components/rooms/RoomCard";
import { Outlet, useNavigate } from "react-router-dom";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { useFetchAllRooms, useFetchMyRooms } from "@/hooks/room/useFetchRooms";
import { useRemoveRoom } from "@/hooks/room/useRemoveRoom";
import ConfirmationDialog from "../../../components/modal/confirmationDialog";
import toast from "react-hot-toast";
import PasswordConfirmation from "@/components/modal/PasswordConfirmation";
import { useJoinRoom, useVerifyRoomPassword } from "@/hooks/room/useJoinRoom";
import { Spinner } from "@/components/ui/spinner";

const filterOptions = [{ value: "isPremium" }, { value: "isPrivate" }];
const sortOptions = [{ value: "Ascending" }, { value: "Descending" }];

export default function RoomsListPage() {
  
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [removeByRoomId, setRemoveByRoomId] = useState("");
  const [isModalPasswordModal, setIsModalPasswordModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const navigate = useNavigate();

  // to fetch my rooms
  const { data: myRooms, isPending: fetchMyRoomPending } = useFetchMyRooms();

  // to fetch all rooms except ours
  const { data: availableRooms, isPending: fetchAllRoomsPending } =
    useFetchAllRooms("users", {
      search,
      sort,
      filter,
      currentPage,
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
      joinRoomMutate(selectedRoomId);
    });

  // onClick for password modal confirm
  const handleVerifyPassword = (password: string) => {
    if (!selectedRoomId) {
      toast.error("RoomId not found!");
      return;
    }

    verifyPasswordMutate({ roomId: selectedRoomId, password });
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

      {(joinIsPending || verifyingIsPending) && <Spinner />}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Rooms</h1>
            <Button
              className="bg-primary-500 dark:bg-primary-600 hover:bg-primary-600/90"
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
              sortOptions={sortOptions}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {availableRooms?.rooms?.length ? (
              availableRooms.rooms.map((room, i) => (
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
                  {fetchAllRoomsPending ? "Loading ..." : "No rooms available"}
                </p>
              </div>
            )}
          </div>

          <Pagination
            totalPages={availableRooms?.totalPage || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
