import { useState } from "react";
import {
  Bell,
  Heart,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RoomCard from "@/components/rooms/RoomCard";
import { Link, Outlet, useNavigate } from "react-router-dom";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";

interface Room {
  id: string;
  name: string;
  description: string;
  participants: { name: string; avatar: string }[];
  hasAward?: boolean;
}

export default function RoomsListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const myRooms: Room[] = [
    {
      id: "29929292",
      name: "CodeCrafters Hub",
      description:
        "A space for developers to discuss programming languages, best practices, and code optimization techniques. Share your projects, get feedback, and collaborate on open-source contributions.",
      participants: [
        { name: "User 1", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "User 2", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "User 3", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "User 4", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
  ];

  const availableRooms: Room[] = Array(6)
    .fill(null)
    .map((_, i) => ({
      id: "29929292",
      name: "CodeCrafters Hub",
      description:
        "A space for developers to discuss programming languages, best practices, and code optimization techniques. Share your projects, get feedback, and collaborate on open-source contributions.",
      participants: [
        { name: "User 1", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "User 2", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "User 3", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "User 4", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      hasAward: i % 2 === 1,
    }));

  return (
    <div className="min-h-screen mt-20">
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
          <Outlet />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myRooms.map((room) => (
              <RoomCard key={room.id} room={room} type="my-room" />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Available Rooms</h2>
            <FilterBar
              setSearchQuery={(value: string) => {}}
              setFilterQuery={(value: string) => {}}
              setSortedOrder={(value: string) => {}}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {availableRooms.map((room, i) => (
              <RoomCard key={`${room.id}-${i}`} room={room} type="available" />
            ))}
          </div>

          <Pagination totalPages={10} onPageChange={(value: number) => {}} />
        </div>
      </div>
    </div>
  );
}
