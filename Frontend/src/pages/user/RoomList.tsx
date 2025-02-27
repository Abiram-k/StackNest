// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import { Bell, Heart, User, Plus, Edit, Trash2, Trophy, ChevronLeft, ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { AvatarGroup } from "@/components/avatar-group"

// interface Room {
//   id: string
//   name: string
//   description: string
//   participants: { name: string; avatar: string }[]
//   hasAward?: boolean
// }

// export default function RoomsList() {
//   const [currentPage, setCurrentPage] = useState(1)

//   const myRooms: Room[] = [
//     {
//       id: "29929292",
//       name: "CodeCrafters Hub",
//       description:
//         "A space for developers to discuss programming languages, best practices, and code optimization techniques. Share your projects, get feedback, and collaborate on open-source contributions.",
//       participants: [
//         { name: "User 1", avatar: "/placeholder.svg?height=32&width=32" },
//         { name: "User 2", avatar: "/placeholder.svg?height=32&width=32" },
//         { name: "User 3", avatar: "/placeholder.svg?height=32&width=32" },
//         { name: "User 4", avatar: "/placeholder.svg?height=32&width=32" },
//       ],
//     },
//   ]

//   const availableRooms: Room[] = Array(6)
//     .fill(null)
//     .map((_, i) => ({
//       id: "29929292",
//       name: "CodeCrafters Hub",
//       description:
//         "A space for developers to discuss programming languages, best practices, and code optimization techniques. Share your projects, get feedback, and collaborate on open-source contributions.",
//       participants: [
//         { name: "User 1", avatar: "/placeholder.svg?height=32&width=32" },
//         { name: "User 2", avatar: "/placeholder.svg?height=32&width=32" },
//         { name: "User 3", avatar: "/placeholder.svg?height=32&width=32" },
//         { name: "User 4", avatar: "/placeholder.svg?height=32&width=32" },
//       ],
//       hasAward: i % 2 === 1,
//     }))

//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <header className="border-b border-gray-200 py-4 px-6">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-12">
//             <Image
//               src="/placeholder.svg?height=48&width=48"
//               alt="Logo"
//               width={48}
//               height={48}
//               className="rounded-full bg-black"
//             />
//             <nav>
//               <ul className="flex gap-8">
//                 <li className="text-lg font-medium">Home</li>
//                 <li className="text-lg font-medium">About</li>
//                 <li className="text-lg font-medium">Daily Challenge</li>
//                 <li className="text-lg font-medium">Highlights</li>
//                 <li className="text-lg font-medium">Contact us</li>
//               </ul>
//             </nav>
//           </div>
//           <div className="flex items-center gap-6">
//             <Bell className="w-6 h-6" />
//             <Heart className="w-6 h-6 text-red-500 fill-red-500" />
//             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//               <User className="w-6 h-6" />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* My Rooms Section */}
//         <div className="mb-12">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-2xl font-bold">My Rooms</h1>
//             <Button className="bg-purple-600 hover:bg-purple-700">
//               <Plus className="w-4 h-4 mr-2" />
//               Create Room
//             </Button>
//           </div>

//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {myRooms.map((room) => (
//               <RoomCard key={room.id} room={room} type="my-room" />
//             ))}
//           </div>
//         </div>

//         {/* Available Rooms Section */}
//         <div>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold">Available Rooms</h2>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline">Filter</Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem>Newest</DropdownMenuItem>
//                 <DropdownMenuItem>Most Popular</DropdownMenuItem>
//                 <DropdownMenuItem>Recently Active</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
//             {availableRooms.map((room, i) => (
//               <RoomCard key={`${room.id}-${i}`} room={room} type="available" />
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-center gap-2">
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             {[1, 2, "...", 9, 10].map((page, i) => (
//               <Button
//                 key={i}
//                 variant={currentPage === page ? "default" : "outline"}
//                 className={page === "..." ? "cursor-default" : ""}
//                 onClick={() => typeof page === "number" && setCurrentPage(page)}
//               >
//                 {page}
//               </Button>
//             ))}
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => setCurrentPage((p) => p + 1)}
//               disabled={currentPage === 10}
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// interface RoomCardProps {
//   room: Room
//   type: "my-room" | "available"
// }

// function RoomCard({ room, type }: RoomCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
//       <div className="flex items-start justify-between">
//         <div>
//           <h3 className="text-lg font-semibold">{room.name}</h3>
//           <p className="text-sm text-gray-500">ID: {room.id}</p>
//         </div>
//         <div className="flex gap-2">
//           {type === "my-room" ? (
//             <>
//               <Button variant="ghost" size="icon">
//                 <Edit className="h-4 w-4" />
//               </Button>
//               <Button variant="ghost" size="icon" className="text-red-500">
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </>
//           ) : (
//             room.hasAward && <Trophy className="h-5 w-5 text-yellow-500" />
//           )}
//         </div>
//       </div>

//       <div className="space-y-4">
//         <div className="flex items-center gap-2">
//           <span className="text-xs text-gray-500">Description:</span>
//           <p className="text-sm line-clamp-2">{room.description}</p>
//         </div>

//         <div className="flex items-center justify-between">
//           <Button
//             className={type === "my-room" ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700"}
//           >
//             {type === "my-room" ? "Enter" : "Join"}
//           </Button>
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-500">10/20</span>
//             <AvatarGroup>
//               {room.participants.map((participant, i) => (
//                 <Avatar key={i}>
//                   <AvatarImage src={participant.avatar} alt={participant.name} />
//                   <AvatarFallback>{participant.name[0]}</AvatarFallback>
//                 </Avatar>
//               ))}
//             </AvatarGroup>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

