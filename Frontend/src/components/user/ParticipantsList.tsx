import { UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ParticipantCard from  "./ParticipantCard"

interface Participant {
  name: string
  avatar: string
  isMuted: boolean
  isVideoOn: boolean
}

interface ParticipantsListProps {
  participants: Participant[]
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <Card className="w-80 bg-purple-100 dark:bg-black h-96 rounded-lg shadow-md">
      <CardHeader className="p-4 bg-primary-500 dark:bg-primary-600 text-white rounded-t-lg">
        <div className="flex items-center">
          <UserPlus className="w-5 h-5 mr-2" />
          <CardTitle className="text-lg font-medium">Participants</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="dark:bg-black p-2 max-h-[calc(100vh-250px)] overflow-y-auto">
        {participants.map((participant,index) => (
          <ParticipantCard key={index} participant={participant} />
        ))}
      </CardContent>
    </Card>
  )
}

