import { Spinner } from "@/components/ui/spinner";
import UserCard from "@/components/UserCard";
import { useBlockUser } from "@/hooks/admin/userManagement/useBlockUser";
import { useBlockRoom } from "@/hooks/room/useBlockRoom";
import { useFetchSelectedRoom } from "@/hooks/room/userFetchSelectedRoom";
import { findTimeSpendBetweenDates } from "@/utils/findDurationBetweenDate";
import { UnlockIcon, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function RoomDetails() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    toast.dismiss();
    toast.success("Room ID is missing!");
    return;
  }

  const { data: selectedRoom, isPending: isGetRoomPending } =
    useFetchSelectedRoom("admin", roomId);

  const { mutate: roomBlockMutate } = useBlockRoom();

  const handleBlockRoom = () => {
    roomBlockMutate(roomId);
  };

  const { mutate: userBlockMutate, isPending: userBlockPending } =
    useBlockUser();

  const handleBlockUser = (userName: string) => {
    userBlockMutate(userName);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black ">
      {(userBlockPending || isGetRoomPending) && <Spinner />}

      <div className="flex-1 overflow-y-auto ">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Rooms Details</h1>

            {selectedRoom?.room?.isBlocked ? (
              <div className="flex gap-2 items-center">
                <p className="text-orange-400 font-semibold">
                  This room is blocked
                </p>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                  onClick={handleBlockRoom}
                >
                  <UnlockIcon size={20} />
                </button>
              </div>
            ) : (
              <button
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                onClick={handleBlockRoom}
              >
                <Lock size={20} />
              </button>
            )}
          </div>

          <div className="flex gap-8">
            {selectedRoom?.room.roomType !== "general" && (
              <UserCard
                lastSeen={selectedRoom?.room.host?.lastLogin || ""}
                isCurrentUser={false}
                isVerified={selectedRoom?.room.host?.isVerified || false}
                isProcessing={isGetRoomPending || userBlockPending}
                userName={selectedRoom?.room.host?.userName || ""}
                avatar={selectedRoom?.room.host?.avatar || ""}
                gender={selectedRoom?.room.host?.gender || ""}
                email={selectedRoom?.room.host?.email || ""}
                isBlocked={false}
                onToggleBlock={handleBlockUser}
              />
            )}
            <div className="w-1/3">
              <h2 className="text-2xl font-bold mb-4">
                {selectedRoom?.room.title}
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <div>
                      <p className="text-gray-500">Description:</p>
                      <p className="text-sm">
                        {selectedRoom?.room.description}
                      </p>
                    </div>
                  </div>
                </div>

                <InfoItem
                  label="Limit"
                  value={`${selectedRoom?.room?.participants?.length || 0}/${
                    selectedRoom?.room?.limit || 0
                  }`}
                />
                <InfoItem
                  label="Created at"
                  value={String(selectedRoom?.room.createdAt) || "00:00:00"}
                />
                <InfoItem
                  label="Ended at"
                  value={
                    String(
                      selectedRoom?.room.endedAt
                        ? selectedRoom?.room.endedAt
                        : "Not specified"
                    ) || "00:00:00"
                  }
                />
                <InfoItem label="Duration" value="__:__:__ hr" />
                <InfoItem
                  label="Is private"
                  value={String(selectedRoom?.room.isPrivate) || ""}
                />
                <InfoItem
                  label="Is Premium"
                  value={String(selectedRoom?.room.isPremium) || ""}
                />
              </div>
            </div>

            <div className="w-1/3">
              <div
                className="bg-primary-500 dark:hover:bg-primary-500/90 dark:bg-primary-600 dark:text-gray-300 
               text-white p-4 rounded-t-lg"
              >
                <h3 className="text-xl font-semibold">Participants</h3>
              </div>
              <div className="border border-gray-200 border-t-0 rounded-b-lg overflow-hidden ">
                <div className="max-h-[500px] overflow-y-auto">
                  {selectedRoom?.room?.participants?.length ? (
                    selectedRoom.room.participants.map((participant, index) => (
                      <ParticipantItem
                        key={index}
                        avatar={participant.user.avatar}
                        userName={participant.user.userName}
                        duration={
                          !participant.leavedAt
                            ? "Ongoing"
                            : findTimeSpendBetweenDates(
                                participant.joinedAt,
                                participant.leavedAt
                              )
                        }
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 p-4">
                      No participants yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-gray-500">{label} :</div>
      <div>{value}</div>
    </div>
  );
}

function ParticipantItem({
  avatar,
  userName,
  duration,
}: {
  avatar: string;
  userName: string;
  duration: string;
}) {
  return (
    <div className="flex items-center justify-between p-4  border-gray-600 hover:bg-gray-50 border-b-1 dark:bg-transparent">
      <div className="flex items-center">
        <img
          src={avatar}
          alt={userName + "profile"}
          width={48}
          height={48}
          className="rounded-full mr-3"
        />
        <span className="font-medium">{userName}</span>
      </div>
      <div className="flex items-center">
        <span
          className={`${
            duration != "Ongoing" ? "bg-red-500" : "bg-green-500"
          } h-2 w-2 rounded-full mr-2`}
        ></span>
        <span className="text-gray-500 text-sm">{duration || "00:00:00"}</span>
      </div>
    </div>
  );
}
