import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useGetReplies } from "@/hooks/feeds/useGetReplies";

type CommentType = {
  id: string;
  userId: {
    userName: string;
    avatar: string;
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

  return (
    <div className={`mt-3 ml-[${indent}px]`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={comment.userId.avatar} />
          <AvatarFallback>{comment.userId.userName}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg p-3 dark:bg-black ">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.userId.userName}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
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
