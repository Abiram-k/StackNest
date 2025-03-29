"use client";

import { useRef, useState } from "react";
import { Heart, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FeedResType } from "@/types";
import { useNavigate } from "react-router-dom";

type FeedItemProp = FeedResType & {
  handleEdit?: () => void;
  isLikedFeed?: boolean;
  handleDelete?: (feedId: string) => void;
  handleLikeFeed?: (feedId: string) => void;
};
export default function FeedItem({
  isLikedFeed,
  handleLikeFeed,
  handleDelete,
  handleEdit,
  feedId,
  userId,
  uploadedAt,
  title,
  content,
  likes,
  media,
  comments,
}: FeedItemProp) {
  const [liked, setLiked] = useState(isLikedFeed);
  const [likeCount, setLikeCount] = useState(likes);
  const [comentCount, setCommentCount] = useState(comments);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const navigate = useNavigate();
  const isVideo = media?.match(/\.(mp4|webm|ogg)$/i);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleLike = () => {
    handleLikeFeed?.(feedId);
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <div className="border-b pb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={userId.avatar} alt={userId.userName} />
            <AvatarFallback>{userId.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{userId.userName}</h3>
            <p className="text-sm text-gray-500">{uploadedAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {handleEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
              onClick={() => navigate(`/user/profile/my-feed/${feedId}/edit`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {handleDelete && (
            <Button
              onClick={() => handleDelete?.(feedId)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-gray-700">{content}</p>

        {media && (
          <div className="mt-4 space-y-2 w-full">
            <div className="relative h-64 w-full flex justify-center items-center overflow-hidden rounded-lg bg-gray-100">
              {isVideo ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={media}
                    autoPlay
                    loop
                    muted={isMuted}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-2 right-2 flex space-x-2">
                    <button
                      onClick={togglePlayPause}
                      className="bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-md focus:outline-none"
                    >
                      {isPlaying ? "Pause ⏸️" : "Play ▶️"}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-md focus:outline-none"
                    >
                      {isMuted ? "Unmute 🔊" : "Mute 🔇"}
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={media || "/placeholder.svg"}
                  alt={"Post media"}
                  className="object-cover w-full h-full rounded-lg"
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center mt-4 gap-6">
      
      </div>
      <div className="flex -space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          onClick={handleLike}
          disabled={!handleLikeFeed}
        >
          <Heart
            className={`h-5 w-5 ${!liked ? "fill-red-500 text-red-500" : ""}`}
          />
          <span>Like {likeCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Comment </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          {comentCount} Reply
        </Button>
      </div>
    </div>
  );
}
