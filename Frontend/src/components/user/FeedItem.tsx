import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Heart,
  MessageSquare,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FeedResType } from "@/types";
import { useNavigate } from "react-router-dom";
import WarningMessage from "../ui/WarningMessage";
import { useCommentFeed } from "@/hooks/feeds/useCommentFeed";
import { useGetComments } from "@/hooks/feeds/useGetComments";
import { CommentItem } from "./CommentItem";
import { useIncrementViewsCount } from "@/hooks/feeds/useIncrementViews";
import { toast } from "sonner";
import ReportModal from "../modal/ReportModal";

type CommentType = {
  id: string;
  userId: {
    userName: string;
    avatar: string;
    isVerified: boolean;
  };
  text: string;
  replyCount?: number;
  replies: CommentType[];
  createdAt: string;
};

type FeedItemProp = FeedResType & {
  handleEdit?: () => void;
  isLikedFeed?: boolean;
  isSingleFeed: boolean;
  handleDelete?: (feedId: string) => void;
  handleLikeFeed?: (feedId: string) => void;
};
export default function FeedItem({
  isSingleFeed,
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
  isBlocked,
  viewsCount,
}: FeedItemProp) {
  const [liked, setLiked] = useState(isLikedFeed);
  const [likeCount, setLikeCount] = useState(likes);
  // const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [newComment, setNewComment] = useState("");
  const [feedComments, setFeedComments] = useState<CommentType[]>();
  const [showComments, setShowComments] = useState<boolean>(false);
  const postRef = useRef<HTMLDivElement | null>(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const navigate = useNavigate();

  const { mutate: postCommentMutate } = useCommentFeed();
  const { data: commentsList } = useGetComments(feedId, showComments);
  const { mutate: IncrementViewsMutate } = useIncrementViewsCount();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          IncrementViewsMutate(feedId);
        }
      },
      { threshold: 0.5 }
    );
    if (postRef.current) {
      observer.observe(postRef.current);
    }
    return () => {
      if (postRef.current) observer.unobserve(postRef.current);
    };
  }, [feedId]);

  useEffect(() => {
    if (commentsList) setFeedComments(commentsList?.comments);
  }, [commentsList?.comments]);

  const isVideo = media?.match(/\.(mp4|webm|ogg)$/i);

  const handleLike = () => {
    handleLikeFeed?.(feedId);
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: CommentType = {
        id: Math.random().toString(),
        userId: {
          isVerified: false,
          userName: "You",
          avatar:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        },
        text: newComment,
        replies: [],
        createdAt: new Date().toISOString(),
      };
      setFeedComments((prev) => (prev ? [...prev, newCommentObj] : prev));
      postCommentMutate({ feedId, parentId: null, comment: newComment });
      setNewComment("");
    }
  };

  const handleReply = (parentId: string, text: string) => {
    const newReply: CommentType = {
      id: Math.random().toString(),
      userId: {
        isVerified: userId.isVerified,
        userName: userId.userName || "You",
        avatar:
          userId.avatar ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      },
      text,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    const updateComments = (comments: CommentType[]): CommentType[] => {
      return comments.map((comment) => {
        if (comment.id === parentId) {
          return { ...comment, replies: [...comment.replies, newReply] };
        }
        return {
          ...comment,
          replies: updateComments(comment.replies),
        };
      });
    };
    // setFeedComments((prev) => prev && updateComments(prev));
    postCommentMutate({ feedId, parentId, comment: text }); // Adding reply to DB
  };

  const handleShare = async (feedId: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: content,
          url: `${window.location.origin}/user/highlights/${feedId}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast.warning("Your browser does not support sharing feature");
    }
  };

  return (
    <div
      className="border-b border-gray-200 dark:border-gray-800 pb-6"
      ref={postRef}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => navigate(`/user/${userId.userName}/view`)}
        >
          <Avatar className="h-12 w-12 border-2 border-white ring-2 ring-primary/10 ">
            <AvatarImage src={userId.avatar} alt={userId.userName} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {userId.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex gap-2  items-center">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {userId.userName}
              </h3>
              {userId.isVerified && (
                <span>
                  <CheckCircle2 className="w-5 h-5 text-blue-600 bg-white rounded-full" />
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {uploadedAt}
            </p>
          </div>
        </div>
        {/* Views and Actions */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mb-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Eye className="h-4 w-4 mr-1" />
            <span className="font-medium">{viewsCount} views</span>
          </div>

          <div className="flex items-center gap-2">
            {isBlocked && (
              <WarningMessage
                message="This post is restricted"
                className="px-3 py-1.5 bg-yellow-100/80 text-yellow-700 rounded-lg"
              />
            )}

            <div className="flex items-center gap-1 border dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-800/50">
              {handleEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 rounded-full gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() =>
                    navigate(`/user/profile/my-feed/${feedId}/edit`)
                  }
                >
                  <Pencil className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}

              {handleDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 rounded-full gap-2 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  onClick={() => handleDelete?.(feedId)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              )}
              {!handleEdit && !handleDelete && (
                <ReportModal entityId={feedId} type="feed" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <div>
          <p className="mt-1 text-gray-700 inline dark:text-gray-100">
            {descriptionExpanded ? content : content.slice(0, 120)}
          </p>
          {!descriptionExpanded && (
            <button
              onClick={() => setDescriptionExpanded(true)}
              className="text-gray-400 bg-transparent dark:text-gray-600 text-sm font-medium hover:underline ms-2 inline"
            >
              Read more ...
            </button>
          )}
        </div>

        {media && (
          <div className="mt-4 space-y-2 w-full">
            <div className="relative aspect-video w-full flex justify-center items-center overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
              {isVideo ? (
                <div className="relative w-full h-full group">
                  <video
                    ref={videoRef}
                    controls
                    src={media}
                    autoPlay
                    loop
                    // muted={isMuted}
                    className="w-full h-full object-cover rounded-xl"
                  >
                    <source src={media} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={media || "/placeholder.svg"}
                    alt="Post media"
                    className="object-contain w-full h-full rounded-xl "
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center mt-6 gap-4 ">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full dark:hover:text-red-600 hover:text-red-600"
            onClick={handleLike}
            // disabled={!handleLikeFeed}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                liked ? "fill-red-500 text-red-500" : "hover:text-red-400"
              }`}
            />
            <span className="font-medium">{likeCount}</span>
          </Button>

          <Button
            variant="ghost"
            // size="sm"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full dark:hover:text-blue-600 hover:text-blue-600"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-5 w-5 " />
            <span className="font-medium">{comments}</span>
          </Button>
          {!isSingleFeed && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full hover:text-green-600 dark:hover:text-green-400 transition-colors"
              onClick={() => handleShare(feedId)}
              aria-label="Share post"
            >
              <Share2 className="h-5 w-5" />
              <span className="font-medium">Share</span>
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "Hide Replies" : "Show Replies"}
        </Button>
      </div>

      {showComments && (
        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border dark:border-gray-700 rounded-full px-4 py-2 bg-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            />
            <Button
              onClick={handleAddComment}
              className="rounded-full px-6 bg-primary-500 hover:bg-primary-600 text-white"
            >
              Post
            </Button>
          </div>

          <CommentList
            setFeedComments={setFeedComments}
            feedComments={feedComments}
            setComments={setFeedComments}
            comments={feedComments}
            feedId={feedId}
            onReply={handleReply}
          />
        </div>
      )}
    </div>
  );
}

export function CommentList({
  setFeedComments,
  feedComments,
  comments,
  onReply,
  feedId,
}: {
  setFeedComments: React.Dispatch<
    React.SetStateAction<CommentType[] | undefined>
  >;
  feedComments: CommentType[] | undefined;
  setComments: React.Dispatch<React.SetStateAction<CommentType[] | undefined>>;
  comments: CommentType[] | undefined;
  onReply: (parentId: string, text: string) => void;
  feedId: string;
}) {
  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
        <CommentItem
          setFeedComments={setFeedComments}
          feedComments={feedComments}
          key={comment.id}
          feedId={feedId}
          comment={comment}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
