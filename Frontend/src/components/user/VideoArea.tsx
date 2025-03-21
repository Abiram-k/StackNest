import { Pin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface VideoAreaProps {
  hostName: string
  isVideoOn: boolean
}

export default function VideoArea({ hostName, isVideoOn }: VideoAreaProps) {
  return (
    <Card className="w-full h-full overflow-hidden shadow-md rounded-lg dark:bg-black">
      <CardContent className="p-0 h-full relative">
        {isVideoOn ? (
          <div className="w-full h-full bg-gray-400 relative dark:bg-gray-600">
            <img src="/placeholder.svg?height=600&width=800" alt="Video feed" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 flex items-center">
              <Pin className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm font-medium bg-black/50 text-white px-2 py-1 rounded">{hostName}</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">👤</div>
              <p>{hostName}</p>
              <p className="text-sm text-gray-400">Camera is off</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

