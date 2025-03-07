import { Spinner } from "@/components/ui/spinner";
import { useBlockRoom } from "@/hooks/room/useBlockRoom";
import { useFetchSelectedRoom } from "@/hooks/room/userFetchSelectedRoom";
import {
  Trash2,
  LogOut,
  User,
  ShoppingBag,
  Flag,
  LayoutGrid,
  CreditCard,
  BarChart2,
  Bell,
  FileText,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function RoomDetails() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    toast.success("Room ID is missing!");
    return;
  }

  const { data: selectedRoom, isPending: isGetRoomPending } =
    useFetchSelectedRoom("admin", roomId);

//   const { mutate: roomBlockMutate } = useBlockRoom();

  const handleBlockRoom = () => {
    // roomBlockMutate(roomId);
  };

  return (
    <div className="flex h-screen bg-white">
      {isGetRoomPending && <Spinner />}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Rooms Details</h1>
            <button
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
              onClick={handleBlockRoom}
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex gap-8">
            {/* Left Column */}
            <div className="w-1/3">
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <div className="bg-blue-500 h-12"></div>
                <div className="p-6 flex flex-col items-center">
                  <div className="relative -mt-12 mb-4">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt="Elizabeth"
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-white"
                    />
                  </div>
                  <h3 className="font-bold text-lg">Elizabeth (HOST)</h3>
                  <p className="text-gray-600 mb-6">Senior Web Developer</p>

                  <div className="flex w-full justify-between mb-6">
                    <div className="text-center">
                      <p className="font-bold">10</p>
                      <p className="text-gray-600 text-sm">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">442</p>
                      <p className="text-gray-600 text-sm">Connections</p>
                    </div>
                  </div>

                  <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full transition-colors">
                    Block User
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Column */}
            <div className="w-1/3">
              <h2 className="text-2xl font-bold mb-4">CodeCrafters Hub</h2>

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
                        A space for developers to discuss programming languages,
                        best practices, and team optimization techniques. Share
                        your projects, get feedback, and collaborate on
                        open-source contributions.
                      </p>
                    </div>
                  </div>
                </div>

                <InfoItem label="Limit" value="10 / 20" />
                <InfoItem label="Created at" value="10 / 01 /2025" />
                <InfoItem label="Ended at" value="10 / 01 /2025" />
                <InfoItem label="Duration" value="10:00:00 hr" />
                <InfoItem label="Is private" value="Yes" />
                <InfoItem label="Is Premium" value="Yes" />
              </div>
            </div>

            {/* Right Column */}
            <div className="w-1/3">
              <div className="bg-blue-500 text-white p-4 rounded-t-lg">
                <h3 className="text-xl font-semibold">Participants</h3>
              </div>
              <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <ParticipantItem key={i} />
                    ))}
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

function ParticipantItem() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex items-center">
        <img
          src="/placeholder.svg?height=48&width=48"
          alt="Dianne Russell"
          width={48}
          height={48}
          className="rounded-full mr-3"
        />
        <span className="font-medium">Dianne Russell</span>
      </div>
      <div className="flex items-center">
        <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
        <span className="text-gray-500 text-sm">01:39:12</span>
      </div>
    </div>
  );
}
