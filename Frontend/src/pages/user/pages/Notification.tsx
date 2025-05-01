import NotificationCard from "@/components/card/NotificationCard";
import { Spinner } from "@/components/ui/spinner";
import { useAcceptRequest } from "@/hooks/user/connection/useAcceptRequest";
import { useGetNotification } from "@/hooks/user/connection/useGetNotification";
import { useRejectRequest } from "@/hooks/user/connection/useRejectRequest";

const Notification = () => {
  const { data: notificationData, isPending } = useGetNotification();
  const { mutate: acceptRequestMutate, isPending: acceptPending } =
    useAcceptRequest();
  const { mutate: rejectRequestMutate, isPending: rejectPending } =
    useRejectRequest();
  const handleAcceptConnection = (requestId: string) => {
    acceptRequestMutate(requestId);
  };
  const handleRejectConnection = (requestId: string) => {
    rejectRequestMutate(requestId);
  };
  return (
    <div className="flex h-screen mt-10  overflow-x-hidden">
      {(isPending || acceptPending || rejectPending) && <Spinner />}
      <div className="flex-1  p-8 w-full">
        <div className=" flex justify-between mb-10 flex-col md:flex-row">
          <h1 className="text-2xl font-bold mb-8 border-b pb-2">
            Notifications
          </h1>
        </div>
        <div className="grid items-center md:items-stretch  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {notificationData?.notifications &&
          notificationData.notifications.length > 0 ? (
            notificationData.notifications.map((notification) => (
              <NotificationCard
                key={notification.notificationId}
                notificationId={notification.notificationId}
                onAccept={handleAcceptConnection}
                onReject={handleRejectConnection}
                name={notification.sender.userName}
                timeAgo={String(notification.sendedAt)}
                message={"Connection Request"}
                profileImage={notification.sender.avatar}
                isFriendRequest
              />
            ))
          ) : (
            <div className="flex items-center justify-center w-screen -ms-12 md:-ms-92">
              <div className="text-center text-gray-500 mt-8  w-full">
                <p className="text-lg font-medium">No notifications found</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
