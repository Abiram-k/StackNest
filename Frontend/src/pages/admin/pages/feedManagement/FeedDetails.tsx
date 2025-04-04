import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  User,
  Shield,
  Clock,
  ImageIcon,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFeedDetails } from "@/hooks/admin/feedManagement/useGetFeedDetails";
import { useBlockUser } from "@/hooks/admin/userManagement/useBlockUser";
import { useToggleBlockFeed } from "@/hooks/admin/feedManagement/useToggleBlockFeed";
import { TextAreaModal } from "@/components/modal/TextAreaModal";
import { useAdminDeleteFeed } from "@/hooks/admin/feedManagement/useAdminDeleteFeed";
import { Spinner } from "@/components/ui/spinner";

const FeedDetails: React.FC = () => {
  const [isPublished, setIsPublished] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isReasonRequired, setIsReasonRequired] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const { feedId } = useParams<{ feedId: string }>();
  const navigate = useNavigate();

  const { data: feedDetailsData, isLoading } = useGetFeedDetails(feedId!);
  const { mutate: blockUserMutate, isPending: blockUserPending } =
    useBlockUser();
  const { mutate: blockFeedMutate, isPending: blockFeedPending } =
    useToggleBlockFeed();
  const { mutate: deleteFeedMutate, isPending: deleteFeedPending } =
    useAdminDeleteFeed();

  useEffect(() => {
    setIsPublished(feedDetailsData?.feedDetails.isPublished || true);
    setIsBlocked(feedDetailsData?.feedDetails.isBlocked || false);
  }, [feedDetailsData?.feedDetails]);

  console.log("Feed data: ", feedDetailsData);

  const handleToggleBlock = () => {
    blockFeedMutate(feedId!, {
      onSuccess: () => {
        setIsBlocked(!isBlocked);
      },
    });
  };

  const deleteFeedAfterWithReason = (reason: string) => {
    deleteFeedMutate({ feedId: feedId!, reason });
  };

  const handleDelete = () => {
    setIsReasonRequired(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="ml-4 space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {blockUserPending && blockFeedPending && <Spinner />}
      {isReasonRequired && (
        <TextAreaModal
          onSubmit={deleteFeedAfterWithReason}
          placeholder="Enter the reason for feed removal"
          isOpen={isReasonRequired}
          onClose={() => setIsReasonRequired(false)}
          cancelButtonText="Cancel"
          isSubmitting={deleteFeedPending}
          submitButtonText="Submit Reason"
          submitButtonVariant="destructive"
          textAreaLabel="Reason for Feed Deletion: "
          title="Confirm Feed Deletion"
          maxLength={599}
          description="Please provide a clear and specific reason for removing this feed. The submitted reason will be communicated to the feed owner via email for transparency and accountability."
          initialValue="After a detailed review of your feed activity, we have determined that it violates our community guidelines and terms of service. Consequently, your feed has been removed from StackNest. If you believe this was done in error, you may contact our support team for further assistance."
        />
      )}
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-3 md:gap-0">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feeds
        </Button>
        <div className="flex gap-2">
          <Button variant={isPublished ? "default" : "outline"}>
            {isPublished ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Published
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Unpublished
              </>
            )}
          </Button>
          <Button
            variant={isBlocked ? "destructive" : "outline"}
            onClick={handleToggleBlock}
          >
            {isBlocked ? (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Blocked
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Not Blocked
              </>
            )}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {feedDetailsData?.feedDetails.title}
                  </CardTitle>
                  <CardDescription>
                    {feedDetailsData?.feedDetails?.updatedAt
                      ? `Last Updated At: ${format(
                          new Date(feedDetailsData.feedDetails.updatedAt),
                          "PPPP"
                        )}`
                      : "Updated date unavailable"}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  {isPublished ? (
                    <Badge variant="default">Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                  {isBlocked && <Badge variant="destructive">Blocked</Badge>}
                  {feedDetailsData?.feedDetails.scheduledAt && (
                    <Badge variant="secondary">
                      <Calendar className="mr-1 h-3 w-3" />
                      Scheduled
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: descriptionExpanded
                      ? feedDetailsData?.feedDetails.content ?? ""
                      : feedDetailsData?.feedDetails.content?.slice(0, 130) ??
                        "",
                  }}
                />

                {!descriptionExpanded && (
                  <button
                    onClick={() => setDescriptionExpanded(true)}
                    className="text-gray-400 bg-transparent dark:text-gray-600 text-sm font-medium hover:underline  inline"
                  >
                    Read more ...
                  </button>
                )}
              </div>

              {feedDetailsData?.feedDetails.media && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Media
                  </h3>
                  <div className="rounded-md overflow-hidden border">
                    {feedDetailsData.feedDetails.media
                      .toLowerCase()
                      .endsWith(".mp4") ? (
                      <video
                        controls
                        className="w-full h-auto max-h-[400px] object-contain"
                      >
                        <source
                          src={feedDetailsData.feedDetails.media}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={
                          feedDetailsData.feedDetails.media ||
                          "/placeholder.svg"
                        }
                        alt="Feed media"
                        className="w-full h-auto max-h-[400px] object-contain"
                      />
                    )}
                  </div>
                </div>
              )}

              {feedDetailsData?.feedDetails.scheduledAt && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Scheduled Time
                  </h3>
                  <p>
                    {format(
                      new Date(feedDetailsData?.feedDetails.scheduledAt),
                      "PPPP"
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="comments" className="mt-6">
            <TabsList>
              <TabsTrigger value="comments">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comments ({feedDetailsData?.feedDetails.comments.length})
              </TabsTrigger>
              <TabsTrigger value="views">
                <Eye className="mr-2 h-4 w-4" />
                Views ({feedDetailsData?.feedDetails.views.length})
              </TabsTrigger>
              <TabsTrigger value="likes">
                <Heart className="mr-2 h-4 w-4" />
                Likes ({feedDetailsData?.feedDetails.likes.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>All comments on this feed</CardDescription>
                </CardHeader>
                <CardContent>
                  {feedDetailsData?.feedDetails.comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6">
                      No comments yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {feedDetailsData?.feedDetails.comments.map(
                        (comment: any) => (
                          <div
                            key={comment._id}
                            className="flex gap-4 pb-4 border-b last:border-0"
                          >
                            <Avatar>
                              <AvatarImage src={comment.user?.profilePicture} />
                              <AvatarFallback>
                                {comment.user?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  {comment.user?.name}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(comment.createdAt), "PPPP")}
                                </span>
                              </div>
                              <p className="mt-1">{comment.content}</p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="views">
              <Card>
                <CardHeader>
                  <CardTitle>Views</CardTitle>
                  <CardDescription>Users who viewed this feed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">
                      {feedDetailsData?.feedDetails.viewsCount} total views
                    </span>
                  </div>
                  {feedDetailsData?.feedDetails.views.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6">
                      No view data available
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-44">
                      {feedDetailsData?.feedDetails.views.map(
                        (userId: string) => (
                          <div
                            key={userId}
                            className="flex items-center gap-2 p-2 border rounded-md w-fit"
                          >
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm w-fit">
                              {/* {userId.substring(userId.length - 6)} */}
                              {userId}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="likes">
              <Card>
                <CardHeader>
                  <CardTitle>Likes</CardTitle>
                  <CardDescription>Users who liked this feed</CardDescription>
                </CardHeader>
                <CardContent>
                  {feedDetailsData?.feedDetails.likes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6">
                      No likes yet
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-44">
                      {feedDetailsData?.feedDetails.likes.map(
                        (userId: string) => (
                          <div
                            key={userId}
                            className="flex items-center w-fit gap-2 p-2 border rounded-md"
                          >
                            <Heart className="h-4 w-4 text-rose-500" />
                            <span className="text-sm ">{userId}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={feedDetailsData?.feedDetails.userId?.avatar}
                  />
                  <AvatarFallback>
                    {feedDetailsData?.feedDetails.userId?.name?.charAt(0) ||
                      "User"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {feedDetailsData?.feedDetails.userId?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {feedDetailsData?.feedDetails.userId?.email}
                  </p>
                </div>
              </div>
              <Button
                variant={
                  feedDetailsData?.feedDetails.userId.isBlocked
                    ? "outline"
                    : "destructive"
                }
                className="w-full mt-4"
                onClick={() =>
                  blockUserMutate(feedDetailsData?.feedDetails.userId.name!)
                }
              >
                <User className="mr-2 h-4 w-4" />
                {feedDetailsData?.feedDetails.userId.isBlocked
                  ? "Unblock User"
                  : " Block User"}
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Feed Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>Views</span>
                  </div>
                  <Badge variant="secondary">
                    {feedDetailsData?.feedDetails.viewsCount}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>Likes</span>
                  </div>
                  <Badge variant="secondary">
                    {feedDetailsData?.feedDetails.likes.length}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Comments</span>
                  </div>
                  <Badge variant="secondary">
                    {feedDetailsData?.feedDetails.comments.length}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Created</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {feedDetailsData?.feedDetails.createdAt
                      ? format(
                          new Date(feedDetailsData.feedDetails.createdAt),
                          "PPPP"
                        )
                      : "Unknown creation date"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant={isBlocked ? "outline" : "destructive"}
                className="w-full"
                onClick={handleToggleBlock}
              >
                {isBlocked ? (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Unblock Feed
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Block Feed
                  </>
                )}
              </Button>

              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Feed
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedDetails;
