"use client"

import { useState } from "react"
// import Image from "next/image"
import { Bell, Heart, User, Mic, Video, Hand, MessageSquare, MoreHorizontal, Plus, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function VideoConference() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const requests = [
    { id: 1, name: "Elmer Laverty", avatar: "/placeholder.svg?height=40&width=40", approved: true },
    { id: 2, name: "Elmer Laverty", avatar: "/placeholder.svg?height=40&width=40", approved: true },
  ]

  const participants = [
    { id: 1, name: "Dianne Russell", avatar: "/placeholder.svg?height=40&width=40", isMuted: false, isVideoOff: false },
    { id: 2, name: "Guy Hawkins", avatar: "/placeholder.svg?height=40&width=40", isMuted: true, isVideoOff: false },
    { id: 3, name: "Kathryn Murphy", avatar: "/placeholder.svg?height=40&width=40", isMuted: true, isVideoOff: false },
    { id: 4, name: "Dianne Russell", avatar: "/placeholder.svg?height=40&width=40", isMuted: false, isVideoOff: false },
    { id: 5, name: "Guy Hawkins", avatar: "/placeholder.svg?height=40&width=40", isMuted: true, isVideoOff: false },
    { id: 6, name: "Kathryn Murphy", avatar: "/placeholder.svg?height=40&width=40", isMuted: true, isVideoOff: false },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="w-16 h-16">
            {/* <Image
              src="/placeholder.svg?height=64&width=64"
              alt="Logo"
              width={64}
              height={64}
              className="rounded-full bg-black"
            /> */}
          </div>
          <nav>
            <ul className="flex gap-8">
              <li className="text-lg font-medium">Home</li>
              <li className="text-lg font-medium">About</li>
              <li className="text-lg font-medium">Daily Challenge</li>
              <li className="text-lg font-medium">Highlights</li>
              <li className="text-lg font-medium">Contact us</li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Bell className="w-6 h-6" />
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* User Credentials */}
      <div className="bg-gray-50 px-6 py-2 text-sm text-gray-700">
        <div>ID: 00001101</div>
        <div>password: 5555</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Requests */}
        <div className="w-72 border-r border-gray-200">
          <div className="bg-purple-600 text-white p-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <span className="text-lg font-medium">Requests</span>
          </div>
          <div className="p-4 space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={request.avatar} alt={request.name} />
                  <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="flex-1">{request.name}</span>
                <div className="flex gap-1">
                  {request.approved && <span className="text-green-500">✓</span>}
                  <span className="text-gray-500">—</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative p-4">
            <div className="relative h-full rounded-lg overflow-hidden border border-gray-200">
              {/* <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Video of Dr. Henny Rizka"
                fill
                className="object-cover"
              /> */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/80 text-black">
                  <span className="text-red-500 mr-1">♪</span> Rikk
                </Badge>
              </div>
              <div className="absolute top-4 left-4 text-white bg-black/50 px-2 py-1 rounded">Dr. Henny Rizka</div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="p-4 flex justify-center gap-4">
            <Button
              variant={isMuted ? "destructive" : "default"}
              size="icon"
              className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setIsMuted(!isMuted)}
            >
              <Mic className="h-6 w-6" />
            </Button>
            <Button
              variant={isVideoOff ? "destructive" : "default"}
              size="icon"
              className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              <Video className="h-6 w-6" />
            </Button>
            <Button
              variant={isHandRaised ? "secondary" : "outline"}
              size="icon"
              className={`rounded-full w-12 h-12 ${isHandRaised ? "bg-gray-200" : "bg-white"}`}
              onClick={() => setIsHandRaised(!isHandRaised)}
            >
              <Hand className="h-6 w-6" />
            </Button>
            <Button
              variant={isChatOpen ? "secondary" : "outline"}
              size="icon"
              className={`rounded-full w-12 h-12 ${isChatOpen ? "bg-gray-200" : "bg-white"}`}
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-white">
              <MoreHorizontal className="h-6 w-6" />
            </Button>
            <Button variant="destructive" className="rounded-full px-6 bg-red-500 hover:bg-red-600">
              End Call
            </Button>
          </div>
        </div>

        {/* Right Sidebar - Participants */}
        <div className="w-80 border-l border-gray-200">
          <div className="bg-purple-600 text-white p-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            <span className="text-lg font-medium">Participants</span>
          </div>
          <div className="p-4 space-y-4">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-3 p-3 rounded-full bg-white shadow-sm">
                <Avatar>
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="flex-1 font-medium">{participant.name}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-blue-500">
                    {participant.isMuted ? <Mic className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-red-500">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

