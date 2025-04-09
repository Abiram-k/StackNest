import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useGetReplies } from "@/hooks/feeds/useGetReplies";
import { CheckCircle2, Trash2 } from "lucide-react";
import { useRemoveComment } from "@/hooks/feeds/useRemoveComment";
import { useGetUserComments } from "@/hooks/feeds/useGetUserComments";

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

export function CommentItem({
  setFeedComments,
  feedComments,
  comment,
  depth = 0,
  onReply,
  feedId,
}: {
  setFeedComments: React.Dispatch<
    React.SetStateAction<CommentType[] | undefined>
  >;
  feedComments: CommentType[] | undefined;
  comment: CommentType;
  depth?: number;
  onReply: (parentId: string, text: string) => void;
  feedId: string;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const { data: repliesData } = useGetReplies(
    feedId,
    comment.id,
    showReplyInput
  );
  const { mutate: removeCommentMutate } = useRemoveComment();
  const { data: userCommentedFeedsData } = useGetUserComments();

  const hasCommented = userCommentedFeedsData?.commentedFeeds.some(
    (id) => comment.id == id
  );

  useEffect(() => {
    if (!repliesData?.comments) return;
    setFeedComments((prevComments = []) =>
      prevComments.map((c) =>
        c.id === repliesData.parentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                ...repliesData.comments.filter(
                  (reply) => !c.replies.some((r) => r.id === reply.id)
                ),
              ],
            }
          : c
      )
    );
  }, [repliesData?.comments]);

  const maxDepth = 4;
  const indent = depth * 4;

  const handleReply = () => {
    if (replyText.trim() && depth < maxDepth) {
      onReply(comment.id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  const handleRemoveComment = () => {
    removeCommentMutate({ feedId, commentId: comment.id });
  };

  return (
    <div className={`mt-3 ml-[${indent}px]`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8  mt-5 bg-transparent ">
          <AvatarImage
            src={comment.userId.avatar}
            className="rounded object-cover"
          />
          <AvatarFallback>{comment.userId.userName}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className=" bg-gray-100 rounded-lg p-3 dark:bg-black ">
            {/* <div> */}

            <div className="flex items-center  gap-2">
              <div className="flex gap-2  items-center justify-center">
                {comment.userId.isVerified && (
                  <span>
                    <CheckCircle2 className="w-4 h-4 text-blue-600 bg-white rounded-full" />
                  </span>
                )}
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {comment.userId.userName}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              {/* </div> */}
              {hasCommented && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 rounded-full gap-2  justify-end text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  onClick={handleRemoveComment}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              )}
            </div>
            <p className="mt-1 text-gray-700 dark:text-gray-400">
              {comment.text}
            </p>
          </div>
          {(!depth || depth < maxDepth) && (
            <div className="mt-2 flex items-center gap-3 ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-gray-500 hover:text-gray-700"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                Reply
              </Button>

              <Button
                disabled
                variant="ghost"
                size="sm"
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                {comment.replyCount || 0} Replies
              </Button>
            </div>
          )}

          {showReplyInput && (
            <>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />
                <Button size="sm" onClick={handleReply}>
                  Post
                </Button>
              </div>

              {comment.replies.length > 0 && (
                <div className="mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      setFeedComments={setFeedComments}
                      feedComments={feedComments}
                      feedId={feedId}
                      key={reply.id}
                      comment={reply}
                      depth={depth + 1}
                      onReply={onReply}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
