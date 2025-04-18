import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Paperclip,
  Send,
  Mic,
  Video,
  ArrowLeft,
  CheckCheck,
  Eye,
  Trash2Icon,
  Phone,
  SmileIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/optimizational/useDebounce";
import { useGetFreinds } from "@/hooks/user/connection/useGetFreinds";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";
import { useGetMessages } from "@/hooks/user/connection/message/useGetMessages";
import { toast } from "sonner";
import { useSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { HttpService } from "@/api/httpService";
import { ImageService } from "@/api/public/imageService";
import { useMessageSeenObserver } from "@/hooks/user/connection/message/useMessageSeenObserver";
import { useGetUnreadMessagesCount } from "@/hooks/user/connection/message/useGetUnreadMessageCount";
import { useDeleteMessage } from "@/hooks/user/connection/message/useDeleteMessage";
import ConfirmationDialog from "@/components/modal/confirmationDialog";
import { CallWebRTCService } from "@/lib/CallWebRTCService";
import { useFetchCallLogs } from "@/hooks/user/connection/useFetchCallLogs";

interface MsgUser {
  _id: string;
  name: string;
  avatar: string;
  userName: string;
}
interface MessageChat {
  id: string;
  senderId: string;
  message: string;
  type: "text" | "image" | "video";
  isRead: boolean;
  reactions: { userId: string; emoji: string }[];
}
type GetMessageRes = {
  friendData: MsgUser;
  userData: MsgUser;
  messages: MessageChat[];
};
type CallView = "none" | "calling" | "ringing" | "in-call" | "incoming";

export default function MessagingApp() {
  const [message, setMessage] = useState("");
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const friendId = queryParams.get("friend") || "";
  const socket = useSocket();
  const [messageData, setMessageData] = useState<GetMessageRes>();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [isFriendOnline, setIsFriendOnline] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectecMessage, setSelectedMessage] = useState<string>("");

  const { data: messageDataAPI } = useGetMessages(friendId);
  const { mutate: deleteMessageMutate, isPending: deletingMessage } =
    useDeleteMessage();

  const [callerId, setCallerId] = useState<string | null>(null);
  const [callerName, setCallerName] = useState<string | null>(null);
  const [callerAvatar, setCallerAvatar] = useState<string | null>(null);
  const [callView, setCallView] = useState<CallView>("none");
  const webrtcService = useRef<CallWebRTCService>();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && webrtcService.current?.remoteStream) {
      audioRef.current.srcObject = webrtcService.current.remoteStream;
    }
  }, [callView]);

  useEffect(() => {
    webrtcService.current = new CallWebRTCService(socket, friendId);

    socket.on("call-ended", ({ from }) => {
      webrtcService.current?.cleanup();
      setCallView("none");
    });

    socket.on("call-accepted", ({ from, callerName, callerAvatar }) => {
      setCallerId(from);
      setCallerAvatar(callerAvatar);
      setCallerName(callerName);
      setCallView("in-call");
    });

    socket.on("signal", handleIncomingSignal);
    socket.on("callRejected", handleCallRejection);

    return () => {
      webrtcService.current?.cleanup();
      socket.off("call-ended");
      socket.off("call-accepted");
      socket.off("signal", handleIncomingSignal);
      socket.off("callRejected", handleCallRejection);
    };
  }, []);

  const handleCallRejection = () => {
    setCallView("none");
    webrtcService.current?.cleanup();
  };

  const handleIncomingSignal = async (signal: any) => {
    if (signal.type === "offer") {
      setCallView("incoming");
      setCallerId(signal.from);
      setCallerAvatar(signal.callerAvatar);
      setCallerName(signal.callerName);
    }
    await webrtcService.current?.handleSignal(signal);
  };

  const startCall = async () => {
    setCallView("calling");
    await webrtcService.current?.initializeCall();
  };

  const acceptCall = async () => {
    await webrtcService.current?.acceptCall();
    setCallView("in-call");
  };

  const rejectCall = () => {
    socket.emit("rejectCall", { to: callerId });
    setCallView("none");
    webrtcService.current?.cleanup();
  };

  const endCall = () => {
    socket.emit("call-end", { to: callerId });
    setCallView("none");
    webrtcService.current?.cleanup();
  };

  useEffect(() => {
    setMessageData(messageDataAPI);
  }, [messageDataAPI]);

  useEffect(() => {
    if (friendId) {
      socket.emit("join-chat", friendId);
    }
    const handleNewMessage = (data: MessageChat) => {
      setMessageData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, data],
          friendData: prev.friendData,
          userData: prev.userData,
        };
      });
    };

    socket.on("new-message", handleNewMessage);

    const handleLocalIsReadTrue = (messageId: string) => {
      setMessageData((prev) => {
        if (!prev) return prev;
        const updatedMessages = prev.messages.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        );
        return {
          ...prev,
          messages: updatedMessages,
        };
      });
    };

    socket.on("message-read", handleLocalIsReadTrue);

    socket.on("message-delete", (messageId) => {
      setMessageData((prev) => {
        if (!prev) return;
        const updatedMessages = prev.messages.filter(
          (message) => message.id !== messageId
        );
        return {
          ...prev,
          messages: updatedMessages,
        };
      });
    });

    socket.on("is-friend-online", (status: boolean) => {
      console.log(` socket.on("is-friend-online") , status is :${status}`);
      setIsFriendOnline(status);
    });

    socket.on("friend-online", (userId: string) => {
      console.log("Friend online event; ", userId);
      if (userId === friendId) {
        setIsFriendOnline(true);
      }
    });
    socket.on("friend-offline", (userId: string) => {
      if (userId === friendId) {
        setIsFriendOnline(false);
      }
    });

    socket.on(
      "reaction-removed",
      (messageId: string, emoji: string, userId: string) => {
        setMessageData((prev) => {
          if (!prev) return;

          const updatedMessages = prev?.messages?.map((message) => {
            if (message.id === messageId) {
              const updatedReactions = message.reactions.filter(
                (reaction) =>
                  !(reaction.userId === userId && reaction.emoji === emoji)
              );
              return {
                ...message,
                reactions: updatedReactions,
              };
            }
            return message;
          });

          return {
            ...prev,
            messages: updatedMessages,
          };
        });
      }
    );

    socket.on(
      "new-reaction",
      (messageId: string, emoji: string, userId: string) => {
        setMessageData((prev) => {
          if (!prev) return;
          const updatedMessages = prev?.messages?.map((message) => {
            if (message.id == messageId) {
              return {
                ...message,
                reactions: [...(message.reactions || []), { userId, emoji }],
              };
            }
            return message;
          });
          return {
            ...prev,
            messages: updatedMessages,
          };
        });
      }
    );

    return () => {
      socket.emit("exit-chat", friendId);
      socket.off("is-friend-online");
      socket.off("friend-online");
      socket.off("friend-offline");
      socket.off("new-message", handleNewMessage);
      socket.off("message-read", handleLocalIsReadTrue);
    };
  }, [friendId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData?.messages]);

  // cliking on file using the icon
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleMessageDelete = () => {
    if (!selectecMessage) return;
    deleteMessageMutate(selectecMessage);
    setIsConfirmModalOpen(false);
    setSelectedMessage("");
  };

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("please choose max.10MB file");
      return;
    }
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const allowedImageExtensions = ["jpeg", "jpg", "png"];
    if (file.type.startsWith("image/")) {
      if (!fileExtension || !allowedImageExtensions.includes(fileExtension)) {
        toast.error("Only .jpeg, .jpg, and .png image files are allowed.");
        return false;
      }
    } else if (!file.type.startsWith("video/")) {
      toast.error("Only image or video files are allowed.");
      return false;
    }
    setSelectedMedia(file);
  };

  const handleSendMessage = (e: React.FormEvent, friendId?: string) => {
    e.preventDefault();
    if (!friendId) toast.warning("Friend id not founded!");
    if (message.trim() && friendId) {
      socket.emit("send-message", friendId, message);
      setMessage("");
    }
  };

  const handleSend = async () => {
    try {
      if (selectedMedia) {
        const httpService = new HttpService();
        const imageService = new ImageService(httpService);
        const credentials = await imageService.getCloudinaryCredentials();

        if (
          !credentials?.signature ||
          !credentials?.timestamp ||
          !credentials?.apiKey ||
          !credentials?.cloudName
        ) {
          toast.dismiss();
          toast.error("Missing Cloudinary credentials");
          return;
        }
        setIsMediaUploading(true);
        const cloudinaryImgURL = await imageService.uploadImage(
          selectedMedia,
          "stackNest",
          credentials.cloudName,
          credentials.apiKey,
          credentials.signature,
          credentials.timestamp
        );
        socket.emit("send-message", friendId, cloudinaryImgURL);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image...");
    } finally {
      setIsMediaUploading(false);
      setSelectedMedia(null);
    }
  };

  const handleClose = () => {
    setSelectedMedia(null);
  };

  const renderMediaPreview = () => {
    if (!selectedMedia) return null;
    const url = URL.createObjectURL(selectedMedia);

    if (selectedMedia.type.startsWith("image/")) {
      return (
        <img
          src={url}
          alt="Preview"
          className="max-h-96 max-w-full rounded-lg"
        />
      );
    }

    if (selectedMedia.type.startsWith("video/")) {
      return (
        <video controls className="max-h-96 max-w-full rounded-lg">
          <source src={url} type={selectedMedia.type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    return <p>Unsupported media type.</p>;
  };

  // const CallOverlay = () => (
  //   <div
  //     className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm
  //       z-50
  //     ${callView === "none" ? "hidden" : "flex"}
  //     ${window.innerWidth >= 1024 ? "items-center justify-center" : ""}`}
  //   >
  //     <div
  //       className={`bg-white dark:bg-gray-800 p-6 rounded-lg
  //       ${window.innerWidth < 1024 ? "w-full h-full" : "max-w-md w-full"}`}
  //     >
  //       {callView === "calling" && (
  //         <div className="flex flex-col items-center h-full justify-center">
  //           <h2 className="text-xl mb-4">
  //             Calling... {messageData?.friendData.name}{" "}
  //           </h2>
  //           <button
  //             onClick={endCall}
  //             className="bg-red-500 text-white px-6 py-2 rounded-full"
  //           >
  //             End Call
  //           </button>
  //         </div>
  //       )}

  //       {callView === "incoming" && (
  //         <div className="flex flex-col items-center h-full justify-center">
  //           <img
  //             src={callerAvatar!}
  //             alt=""
  //             className="rouded w-10 h-10 object-cover"
  //           />
  //           <h2 className="text-xl mb-4">Incoming Call from {callerName}</h2>
  //           <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4">
  //             <button
  //               onClick={acceptCall}
  //               className="bg-green-500 text-white px-6 py-2 rounded-full"
  //             >
  //               Accept
  //             </button>
  //             <button
  //               onClick={rejectCall}
  //               className="bg-red-500 text-white px-6 py-2 rounded-full"
  //             >
  //               Reject
  //             </button>
  //           </div>
  //         </div>
  //       )}

  //       {callView === "in-call" && (
  //         <div className="flex flex-col items-center h-full justify-center">
  //           <img
  //             src={callerAvatar!}
  //             alt=""
  //             className="rouded w-10 h-10 object-cover"
  //           />
  //           <h2 className="text-xl mb-4">In Call with {callerName}</h2>
  //           <audio ref={audioRef} autoPlay className="w-full mb-4" />
  //           <button
  //             onClick={endCall}
  //             className="bg-red-500 text-white px-6 py-2 rounded-full"
  //           >
  //             End Call
  //           </button>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  const CallOverlay = () => (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm z-50
        ${callView === "none" ? "hidden" : "flex"}
        md:items-center md:justify-center`}
    >
      <div
        className={`relative w-full h-full overflow-hidden
          md:max-w-md md:h-auto md:rounded-2xl md:shadow-xl`}
      >
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center h-full p-8 text-white">
          {/* Avatar with ripple effect */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full animate-ripple">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
            </div>
            <img
              src={callerAvatar! || messageData?.friendData.avatar}
              alt=""
              className="w-32 h-32 rounded-full ring-4 ring-white/30 object-cover"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-2">
            {callView === "incoming"
              ? "Incoming Call"
              : callView == "in-call"
              ? `${callerName}`
              : "Calling..."}
          </h2>
          <p className="text-gray-300 mb-12">
            {messageData?.friendData.name || callerName}
          </p>

          {/* Call buttons */}
          <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-6">
            {callView === "incoming" ? (
              <>
                <button
                  onClick={rejectCall}
                  className="p-4 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <button
                  onClick={acceptCall}
                  className="p-4 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={endCall}
                className="p-4 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <audio ref={audioRef} autoPlay className="hidden" />
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div className="md:flex flex-col max-h-screen bg-white dark:bg-black  hidden scrollbar-thin overflow-hidden h-screen p-3  border-b-2 border-gray-200  ">
        <div className="flex flex-1 overflow-hidden">
          <FreindsList />

          {friendId ? (
            <div className="hidden md:flex flex-1 flex-col ">
              <CallOverlay />
              {isConfirmModalOpen && (
                <ConfirmationDialog
                  onCancel={() => {
                    setIsConfirmModalOpen(false);
                    setSelectedMessage("");
                  }}
                  onConfirm={handleMessageDelete}
                  message="Message will delete from everyone"
                />
              )}
              {deletingMessage && <Spinner />}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <img
                    src={messageData?.friendData?.avatar}
                    alt={`${messageData?.friendData.name} avatar`}
                    width={50}
                    height={50}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="flex justify-center items-center gap-2">
                      <h3 className="font-medium">
                        {messageData?.friendData?.name || "No name"}
                      </h3>
                      <span className="text-xs text-gray-500 ">
                        (@{messageData?.friendData?.userName})
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-green-500">
                      {isFriendOnline ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                          <p> Online</p>
                        </>
                      ) : (
                        <p className="flex items-center text-sm text-gray-500">
                          Offline
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-900 dark:text-white rounded-md text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 "
                    onClick={startCall}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    <span>VoiceCall</span>
                  </button>
                  {/* <button className="flex items-center px-3 py-1.5 bg-blue-50 dark:bg-gray-900  rounded-md text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-800">
                    <Video className="h-5 w-5 mr-1" />
                    <span>VideoCall</span>
                  </button> */}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messageData?.messages.map((message) => {
                  return message.senderId == friendId &&
                    message.senderId !== messageData.userData._id ? (
                    <FriendMessageComponent
                      key={message.id}
                      avatar={messageData.friendData.avatar}
                      friendId={messageData.friendData._id}
                      message={message}
                      name={messageData.friendData.name}
                    />
                  ) : (
                    <div className="flex justify-end mt-12" key={message.id}>
                      <div className="relative min-w-32 ">
                        <div className="reactions-container flex gap-1 mt-1 dark:bg-gray-900 rounded absolute bg-gray-20 shadow-md -top-10 left-12">
                          {Object.entries(
                            (message.reactions ?? []).reduce(
                              (
                                acc: Record<string, number>,
                                r: { userId: string; emoji: string }
                              ) => {
                                acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                return acc;
                              },
                              {}
                            )
                          )?.map(([emoji, count]) => (
                            <button
                              key={emoji}
                              className="reaction-btn text-sm p-1 rounded-full flex items-center gap-1"
                            >
                              <span>{emoji}</span>
                              <span>{count}</span>
                            </button>
                          ))}
                        </div>
                        <div
                          className={`${
                            message.type === "text"
                              ? "bg-blue-600 p-3"
                              : "dark:bg-gray-600 bg-gray-200 p-1"
                          } text-white rounded-lg max-w-xs break-words relative`}
                        >
                          {message.type === "image" ? (
                            <img
                              src={message.message}
                              alt="sent image"
                              className="rounded max-w-full h-auto"
                            />
                          ) : message.type === "video" ? (
                            <video
                              src={message.message}
                              controls
                              className="rounded max-w-full h-auto"
                            />
                          ) : (
                            <p className="whitespace-pre-line mb-2 mt-1">
                              {message.message}
                            </p>
                          )}
                          <Trash2Icon
                            className="h-3 w-3 text-white absolute right-3 top-1 z-30 cursor-pointer"
                            onClick={() => {
                              setIsConfirmModalOpen(true);
                              setSelectedMessage(message.id);
                            }}
                          />

                          {message.isRead ? (
                            <span className="absolute bottom-1 right-2 block ">
                              <Eye className="w-4 h-4 text-blue-400 " />
                            </span>
                          ) : (
                            <CheckCheck
                              className={`absolute bottom-1 right-2 w-4 h-4 ${"text-gray-300"}`}
                            />
                          )}
                        </div>
                      </div>
                      <img
                        src={messageData.userData.avatar}
                        alt={`${messageData.userData.name} avatar`}
                        className="rounded-full ml-3 w-10 h-10 object-cover"
                      />
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              {selectedMedia && (
                <MediaModal
                  isPending={isMediaUploading}
                  handleClose={handleClose}
                  handleSend={handleSend}
                  renderMediaPreview={renderMediaPreview}
                />
              )}
              <form className="p-4 border-t">
                <div className="flex items-center bg-white dark:bg-gray-900  border rounded-lg">
                  <button
                    type="button"
                    onClick={handleIconClick}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 px-4 py-2 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 text-blue-600 hover:text-blue-800"
                    disabled={!message.trim()}
                    onClick={(e) =>
                      handleSendMessage(e, messageData?.friendData._id)
                    }
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1  hidden md:flex items-center justify-center ">
              <div className="text-center p-6">
                <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Your Messages</h3>
                <p className="text-gray-500 mb-4">
                  Select a conversation to start Messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden">
        <MobileChat
          friendId={friendId}
          messageData={messageData!}
          socket={socket}
          isFriendOnline={isFriendOnline}
        />
      </div>
    </>
  );
}

// Freind Message Component (Did for toggle IsRead to true)

function FriendMessageComponent({
  friendId,
  message,
  name,
  avatar,
}: {
  message: MessageChat;
  name: string;
  friendId: string;
  avatar: string;
}) {
  const messageSeenRef = useMessageSeenObserver({
    friendId,
    messageId: message.id,
    isRead: message.isRead,
  });
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactions, setReactions] = useState<
    { userId: string; emoji: string }[] | null
  >(message.reactions);
  const [showHover, setShowHover] = useState<boolean>(false);
  const socket = useSocket();
  const handleReaction = async (emoji: string) => {
    const existingReaction = reactions?.find(
      (r) => r.emoji === emoji && r.userId != friendId
    );
    if (existingReaction) {
      socket.emit("delete-reaction", message.id, emoji, friendId);
      setReactions((prev) => {
        if (!prev) return null;
        return prev.filter(
          (reaction) =>
            !(reaction.userId === friendId && reaction.emoji === emoji)
        );
      });
    } else {
      socket.emit("add-reaction", message.id, emoji, friendId);
      setReactions((prev) => {
        if (!prev) return null;
        return [...prev, { userId: friendId, emoji }];
      });
    }
    setShowReactionPicker(false);
  };

  return (
    <div
      className="flex items-start relative mt-12"
      key={message.id}
      onMouseEnter={() => {
        setShowHover(true);
      }}
      onMouseLeave={() => {
        setShowHover(false);
      }}
    >
      <img
        src={avatar}
        alt={`${name} avatar`}
        width={40}
        height={40}
        className="rounded-full mr-3 w-10 h-10 object-cover"
      />
      <div
        className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 max-w-xs break-words"
        ref={messageSeenRef}
      >
        {message.type == "image" ? (
          <img
            src={message.message}
            alt="sent image"
            className="rounded max-w-full h-auto"
          />
        ) : message.type == "video" ? (
          <video
            src={message.message}
            controls
            className="rounded max-w-full h-auto"
          />
        ) : (
          <p className="whitespace-pre-line">{message.message}</p>
        )}
        {!showHover && (
          <div className="reactions-container flex gap-1 mt-1 dark:bg-gray-900 rounded-full absolute bg-gray-20 shadow-md -top-9 left-12">
            {Object.entries(
              (reactions ?? []).reduce(
                (
                  acc: Record<string, number>,
                  r: { userId: string; emoji: string }
                ) => {
                  acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                  return acc;
                },
                {}
              )
            )?.map(([emoji, count]) => (
              <button
                key={emoji}
                className="reaction-btn text-sm p-1 rounded-full "
                onClick={() => handleReaction(emoji)}
              >
                {emoji} {count}
              </button>
            ))}
          </div>
        )}

        {showHover && (
          <button
            className="reaction-trigger absolute -top-4 left-14  dark:text-gray-100 hover:text-gray-700"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
          >
            <SmileIcon className="w-5 h-5" />
          </button>
        )}

        {showReactionPicker && (
          <ReactionPicker
            onSelect={handleReaction}
            onClose={() => setShowReactionPicker(false)}
          />
        )}
      </div>
    </div>
  );
}

function FriendMessageMobileComponent({
  friendId,
  message,
  name,
  avatar,
}: // setLocalIsReadTrue,
{
  message: MessageChat;
  name: string;
  avatar: string;
  friendId: string;
}) {
  const messageSeenRef = useMessageSeenObserver({
    friendId,
    messageId: message.id,
    isRead: message.isRead,
  });
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactions, setReactions] = useState(message.reactions);
  const [showHover, setShowHover] = useState<boolean>(false);
  const socket = useSocket();
  const handleReaction = async (emoji: string) => {
    const existingReaction = reactions.find(
      (r) => r.emoji === emoji && r.userId != friendId
    );
    if (existingReaction) {
      socket.emit("delete-reaction", message.id, emoji, friendId);
      setReactions((prev) =>
        prev.filter(
          (reaction) =>
            !(reaction.userId === friendId && reaction.emoji === emoji)
        )
      );
    } else {
      socket.emit("add-reaction", message.id, emoji, friendId);
      setReactions((prev) => [...prev, { userId: friendId, emoji }]);
    }
    setShowReactionPicker(false);
  };

  return (
    <>
      <div
        className="flex items-start relative mt-12"
        key={message.id}
        onMouseEnter={() => {
          setShowHover(true);
        }}
        onMouseLeave={() => {
          setShowHover(false);
        }}
      >
        <img
          src={avatar}
          alt={`${name} avatar`}
          width={36}
          height={36}
          className="rounded-full mr-2"
        />
        <div
          className="bg-gray-100 dark:bg-gray-900  rounded-lg p-3 max-w-[80%] break-words"
          ref={messageSeenRef}
        >
          {message.type == "image" ? (
            <img
              src={message.message}
              alt="sent image"
              className="rounded max-w-full h-auto"
            />
          ) : message.type == "video" ? (
            <video
              src={message.message}
              controls
              className="rounded max-w-full h-auto"
            />
          ) : (
            <p className="whitespace-pre-line">{message.message}</p>
          )}
        </div>
        {!showHover && (
          <div className="reactions-container flex gap-1 mt-1 dark:bg-gray-900 rounded-full absolute -top-9 left-12">
            {Object.entries(
              (reactions ?? []).reduce(
                (
                  acc: Record<string, number>,
                  r: { userId: string; emoji: string }
                ) => {
                  acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                  return acc;
                },
                {}
              )
            ).map(([emoji, count]) => (
              <button
                key={emoji}
                className="reaction-btn text-sm p-1 rounded-full "
                onClick={() => handleReaction(emoji)}
              >
                {emoji} {count}
              </button>
            ))}
          </div>
        )}
        {showHover && (
          <button
            className="reaction-trigger absolute -top-6 left-12 text-gray-500 dark:gray-100 hover:text-gray-700 
        
        "
            onClick={() => setShowReactionPicker(!showReactionPicker)}
          >
            <SmileIcon className="w-5 h-5" />
          </button>
        )}
        {showReactionPicker && (
          <ReactionPicker
            onSelect={handleReaction}
            onClose={() => setShowReactionPicker(false)}
          />
        )}
      </div>
    </>
  );
}

const EMOJI_LIST = ["👍", "👎", "😄", "❤️", "😢", "😂", "☹️", "👀"];

const ReactionPicker = ({
  onSelect,
  onClose,
}: {
  onSelect: (value: string) => void;
  onClose: () => void;
}) => {
  return (
    <div className="reaction-picker absolute bottom-full right-0 bg-white border rounded-lg shadow-lg p-2 flex gap-1">
      {EMOJI_LIST.map((emoji) => (
        <button
          key={emoji}
          className="emoji-btn text-xl p-1 hover:bg-gray-100 rounded"
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

function MobileChat({
  friendId,
  messageData,
  isFriendOnline,
  socket,
}: {
  isFriendOnline: boolean;
  friendId: string | null;
  messageData: GetMessageRes;
  socket: Socket;
}) {
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectecMessage, setSelectedMessage] = useState<string>("");
  const { mutate: deleteMessageMutate, isPending: deletingMessage } =
    useDeleteMessage();
  const [callerId, setCallerId] = useState<string | null>(null);
  const [callerName, setCallerName] = useState<string | null>(null);
  const [callerAvatar, setCallerAvatar] = useState<string | null>(null);
  const [callView, setCallView] = useState<CallView>("none");
  const webrtcService = useRef<CallWebRTCService>();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && webrtcService.current?.remoteStream) {
      audioRef.current.srcObject = webrtcService.current.remoteStream;
    }
  }, [callView]);

  useEffect(() => {
    webrtcService.current = new CallWebRTCService(socket, friendId!);

    socket.on("call-ended", ({ from }) => {
      webrtcService.current?.cleanup();
      setCallView("none");
    });

    socket.on("call-accepted", ({ from, callerName, callerAvatar }) => {
      setCallerId(from);
      setCallerAvatar(callerAvatar);
      setCallerName(callerName);
      setCallView("in-call");
    });

    socket.on("signal", handleIncomingSignal);
    socket.on("callRejected", handleCallRejection);

    return () => {
      webrtcService.current?.cleanup();
      socket.off("call-ended");
      socket.off("call-accepted");
      socket.off("signal", handleIncomingSignal);
      socket.off("callRejected", handleCallRejection);
    };
  }, [friendId]);

  const handleCallRejection = () => {
    setCallView("none");
    webrtcService.current?.cleanup();
  };

  const handleIncomingSignal = async (signal: any) => {
    if (signal.type === "offer") {
      setCallView("incoming");
      setCallerId(signal.from);
      setCallerAvatar(signal.callerAvatar);
      setCallerName(signal.callerName);
    }
    await webrtcService.current?.handleSignal(signal);
  };

  const startCall = async () => {
    setCallView("calling");
    await webrtcService.current?.initializeCall();
  };

  const acceptCall = async () => {
    await webrtcService.current?.acceptCall();
    setCallView("in-call");
  };

  const rejectCall = () => {
    socket.emit("rejectCall", { to: callerId });
    setCallView("none");
    webrtcService.current?.cleanup();
  };

  const endCall = () => {
    socket.emit("call-end", { to: callerId });
    setCallView("none");
    webrtcService.current?.cleanup();
  };

  const handleMessageDelete = () => {
    if (!selectecMessage) return;
    deleteMessageMutate(selectecMessage);
    setIsConfirmModalOpen(false);
    setSelectedMessage("");
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("please choose max.10MB file");
      return;
    }
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const allowedImageExtensions = ["jpeg", "jpg", "png"];
    if (file.type.startsWith("image/")) {
      if (!fileExtension || !allowedImageExtensions.includes(fileExtension)) {
        toast.error("Only .jpeg, .jpg, and .png image files are allowed.");
        return false;
      }
    } else if (!file.type.startsWith("video/")) {
      toast.error("Only image or video files are allowed.");
      return false;
    }
    setSelectedMedia(file);
  };
  const handleSendMessage = (e: React.FormEvent, friendId?: string) => {
    e.preventDefault();
    if (!friendId) toast.warning("Friend id not founded!");
    if (message.trim() && friendId) {
      socket.emit("send-message", friendId, message);
      setMessage("");
    }
  };
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData?.messages]);

  const handleSend = async () => {
    try {
      if (selectedMedia) {
        const httpService = new HttpService();
        const imageService = new ImageService(httpService);
        const credentials = await imageService.getCloudinaryCredentials();

        if (
          !credentials?.signature ||
          !credentials?.timestamp ||
          !credentials?.apiKey ||
          !credentials?.cloudName
        ) {
          toast.dismiss();
          toast.error("Missing Cloudinary credentials");
          return;
        }
        setIsMediaUploading(true);
        const cloudinaryImgURL = await imageService.uploadImage(
          selectedMedia,
          "stackNest",
          credentials.cloudName,
          credentials.apiKey,
          credentials.signature,
          credentials.timestamp
        );
        socket.emit("send-message", friendId, cloudinaryImgURL);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image...");
    } finally {
      setIsMediaUploading(false);
      setSelectedMedia(null);
    }
  };

  const handleClose = () => {
    setSelectedMedia(null);
  };
  const renderMediaPreview = () => {
    if (!selectedMedia) return null;
    const url = URL.createObjectURL(selectedMedia);

    if (selectedMedia.type.startsWith("image/")) {
      return (
        <img
          src={url}
          alt="Preview"
          className="max-h-96 max-w-full rounded-lg"
        />
      );
    }

    if (selectedMedia.type.startsWith("video/")) {
      return (
        <video controls className="max-h-96 max-w-full rounded-lg">
          <source src={url} type={selectedMedia.type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    return <p>Unsupported media type.</p>;
  };

  const CallOverlay = () => (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm z-50
        ${callView === "none" ? "hidden" : "flex"}
        md:items-center md:justify-center`}
    >
      <div
        className={`relative w-full h-full overflow-hidden
          md:max-w-md md:h-auto md:rounded-2xl md:shadow-xl`}
      >
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center h-full p-8 text-white">
          {/* Avatar with ripple effect */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full animate-ripple">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
            </div>
            <img
              src={callerAvatar! || messageData?.friendData.avatar}
              alt=""
              className="w-32 h-32 rounded-full ring-4 ring-white/30 object-cover"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-2">
            {callView === "incoming"
              ? "Incoming Call"
              : callView == "in-call"
              ? `${callerName}`
              : "Calling..."}
          </h2>
          <p className="text-gray-300 mb-12">
            {messageData?.friendData.name || callerName}
          </p>

          {/* Call buttons */}
          <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-6">
            {callView === "incoming" ? (
              <>
                <button
                  onClick={rejectCall}
                  className="p-4 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <button
                  onClick={acceptCall}
                  className="p-4 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={endCall}
                className="p-4 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <audio ref={audioRef} autoPlay className="hidden" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {friendId ? (
        <div className="flex flex-col  bg-white dark:bg-black h-screen scrollbar-thin">
          {isConfirmModalOpen && (
            <ConfirmationDialog
              onCancel={() => {
                setIsConfirmModalOpen(false);
                setSelectedMessage("");
              }}
              onConfirm={handleMessageDelete}
              message="Message will delete from everyone"
            />
          )}
          {deletingMessage && <Spinner />}
          <CallOverlay />
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Link to="/user/messaging" className="mr-3">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <img
                src={messageData?.friendData.avatar}
                alt={`${messageData?.friendData.name} avatar`}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div>
                {/* <h3 className="font-medium">{messageData?.friendData.name}</h3> */}
                <div className="flex justify-center items-center gap-2">
                  <h3 className="font-medium">
                    {messageData?.friendData?.name || "No name"}
                  </h3>
                  <span className="text-xs text-gray-500 ">
                    (@{messageData?.friendData?.userName})
                  </span>
                </div>
                <div className="flex items-center text-xs text-green-500">
                  {isFriendOnline ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      <p> Online</p>
                    </>
                  ) : (
                    <p className="flex items-center text-sm text-gray-500">
                      Offline
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={startCall}
              >
                <Phone className="h-5 w-5" />
              </button>
              {/* <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <Video className="h-5 w-5" />
              </button> */}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messageData?.messages.map((message) =>
              message.senderId == friendId &&
              message.senderId !== messageData.userData._id ? (
                <FriendMessageMobileComponent
                  avatar={messageData.friendData.avatar}
                  friendId={messageData.friendData._id}
                  message={message}
                  name={messageData.friendData.name}
                  key={message.id}
                />
              ) : (
                <div
                  className=" relative flex justify-end mt-12"
                  key={message.id}
                >
                  <div className="relative min-w-32 ">
                    <div className="reactions-container flex gap-1 mt-1 dark:bg-gray-900 rounded absolute bg-gray-20 shadow-md -top-10 left-12">
                      {Object.entries(
                        (message.reactions ?? []).reduce(
                          (
                            acc: Record<string, number>,
                            r: { userId: string; emoji: string }
                          ) => {
                            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                            return acc;
                          },
                          {}
                        )
                      )?.map(([emoji, count]) => (
                        <button
                          key={emoji}
                          className="reaction-btn text-sm p-1 rounded-full flex items-center gap-1"
                        >
                          <span>{emoji}</span>
                          <span>{count}</span>
                        </button>
                      ))}
                    </div>
                    <div
                      className={`${
                        message.type === "text"
                          ? "bg-blue-600 p-3"
                          : "dark:bg-gray-600 bg-gray-200 p-1"
                      } text-white rounded-lg max-w-xs break-words relative`}
                    >
                      {message.type === "image" ? (
                        <img
                          src={message.message}
                          alt="sent image"
                          className="rounded max-w-full h-auto"
                        />
                      ) : message.type === "video" ? (
                        <video
                          src={message.message}
                          controls
                          className="rounded max-w-full h-auto"
                        />
                      ) : (
                        <p className="whitespace-pre-line mb-2 mt-1">
                          {message.message}
                        </p>
                      )}
                      <Trash2Icon
                        className="h-3 w-3 text-white absolute right-3 top-1 z-30 cursor-pointer"
                        onClick={() => {
                          setIsConfirmModalOpen(true);
                          setSelectedMessage(message.id);
                        }}
                      />

                      {message.isRead ? (
                        <span className="absolute bottom-1 right-2 block ">
                          <Eye className="w-4 h-4 text-blue-400 " />
                        </span>
                      ) : (
                        <CheckCheck
                          className={`absolute bottom-1 right-2 w-4 h-4 ${"text-gray-300"}`}
                        />
                      )}
                    </div>
                  </div>
                  {/* <div
                    className={`${
                      message.type == "text"
                        ? "bg-blue-600 p-3"
                        : "dark:bg-gray-600 bg-gray-200 p-1"
                    } text-white rounded-lg  max-w-[80%] break-words min-w-32`}
                  >
                    {message.type == "image" ? (
                      <img
                        src={message.message}
                        alt="sent image"
                        className="rounded max-w-full h-auto"
                      />
                    ) : message.type == "video" ? (
                      <video
                        src={message.message}
                        controls
                        className="rounded max-w-full h-auto"
                      />
                    ) : (
                      <p className="whitespace-pre-line mb-3">
                        {message.message}
                      </p>
                    )}
                  </div> */}
                  <Trash2Icon
                    className="h-3 w-3 text-white absolute right-3 top-1 z-30 cursor-pointer"
                    onClick={() => {
                      setIsConfirmModalOpen(true);
                      setSelectedMessage(message.id);
                    }}
                  />
                  {message.isRead ? (
                    <span className="absolute bottom-1 right-2 block ">
                      <Eye className="w-4 h-4 text-blue-400 " />
                    </span>
                  ) : (
                    <CheckCheck
                      className={`absolute bottom-1 right-2 w-4 h-4 ${"text-gray-300"}`}
                    />
                  )}
                </div>
              )
            )}
            <div ref={bottomRef} />
            {selectedMedia && (
              <MediaModal
                isPending={isMediaUploading}
                handleClose={handleClose}
                handleSend={handleSend}
                renderMediaPreview={renderMediaPreview}
              />
            )}
          </div>

          <form className="p-4 border-t">
            <div className="flex items-center bg-white border rounded-lg dark:bg-gray-900">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={handleIconClick}
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                type="file"
                accept="image/*,video/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 text-blue-600 hover:text-blue-800"
                disabled={!message.trim()}
                onClick={(e) => handleSendMessage(e, friendId)}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <FreindsList />
      )}
    </>
  );
}

function FreindsList() {
  const [search, setSearch] = useState("");
  const debounceValue = useDebounce(search, 500);
  const navigate = useNavigate();
  const { data: friendsData, isPending: fetchingfriends } = useGetFreinds({
    search: debounceValue,
  });
  const { data: unreadMessageCountData } = useGetUnreadMessagesCount();
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callerId, setCallerId] = useState<string>("");
  const socket = useSocket();
  const [showFriendList, setShowFriendList] = useState<boolean>(true);

  const { data: callLogsData } = useFetchCallLogs(showFriendList);
  useEffect(() => {
    socket.on("signal", handleIncomingSignal);
    return () => {
      socket.off("signal", handleIncomingSignal);
    };
  }, []);

  const handleIncomingSignal = async (signal: any) => {
    if (signal.type === "offer") {
      setIsCalling(true);
      setCallerId(signal.from);
    }
  };
  return (
    <div className="w-full md:w-80 lg:w-96 border-r bg-gray-50 dark:bg-black flex flex-col">
      {fetchingfriends && <Spinner />}

      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button
              variant={"link"}
              className="mr-3"
              onClick={() => navigate("/user/home")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">Messages</h2>
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {unreadMessageCountData?.count && unreadMessageCountData.count}
            </span>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by User name ..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex mt-4 border-b pb-2">
          <button
            className={`flex-1 flex justify-center py-2 text-gray-500 ${
              showFriendList &&
              "border-blue-600 border-b-2 dark:text-white text-black"
            }`}
            onClick={() => setShowFriendList(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <button
            className={`flex-1 flex justify-center py-2 text-gray-500 ${
              !showFriendList &&
              "border-blue-600 border-b-2 dark:text-white text-black"
            }`}
            onClick={() => setShowFriendList(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
        </div>
      </div>

      {showFriendList ? (
        <div className="overflow-y-auto flex-1">
          {friendsData?.friends.length ? (
            friendsData?.friends.map((friend, index) => (
              <div
                key={`${friend.friendId}-${index}`}
                className="flex items-center p-3 hover:bg-gray-100  dark:hover:bg-gray-900 cursor-pointer border-b relative"
                onClick={() => {
                  setCallerId("");
                  setIsCalling(false);
                  navigate(`/user/messaging?friend=${friend.friendId}`);
                }}
              >
                <div className="relative">
                  <img
                    src={friend.avtar}
                    alt="User Avatar"
                    width={50}
                    height={50}
                    className="rounded-full mr-3"
                  />
                  {isCalling && callerId == friend.friendId && (
                    <div className="absolute -right-1 bottom-0">
                      <span className="relative flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <div className="relative inline-flex items-center justify-center rounded-full h-6 w-6 bg-green-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {friend.firstName}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">
                        {friend.lastMessageAt
                          ? formatDistanceToNow(
                              new Date(friend.lastMessageAt)
                            ) + " ago"
                          : ""}
                      </span>
                      {friend.unReadMessageCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                          {friend.unReadMessageCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {friend.lastMessage}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              {debounceValue
                ? `Oops! No result in chat. ${debounceValue}...`
                : "Oops! You haven't connected with anyone yet. ☹️"}
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          {callLogsData?.callLogs?.length ? (
            callLogsData.callLogs.map((log, index) => {
              return (
                <div
                  key={`${log.userName}-${index}`}
                  className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer border-b relative"
                >
                  <div className="relative">
                    <img
                      src={log.avatar}
                      alt={`${log.firstName} Avatar`}
                      width={50}
                      height={50}
                      className="rounded-full mr-3"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {log.firstName}
                        {/* <span className="text-xs text-gray-500 ml-2">
                          (@{log.userName})
                        </span> */}
                      </h3>
                      <div className="flex items-center">
                        <span
                          className={`text-xs ${
                            log.status === "completed"
                              ? "text-green-500"
                              : log.status === "rejected"
                              ? "text-red-500"
                              : "text-orange-500"
                          }`}
                        >
                          {log.status.charAt(0).toUpperCase() +
                            log.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {log.isMeInitiated ? "Outgoing Call" : "Incoming Call"}
                      {/* <span className="ml-2 text-xs">
                        {log.duration ? `${log.duration}m` : ""}
                      </span> */}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-4">
              No call history available
            </p>
          )}
        </div>
      )}
    </div>
  );
}
interface IMediaModalProps {
  renderMediaPreview: () => React.ReactNode;
  handleClose: () => void;
  handleSend: () => void;
  isPending: boolean;
}
function MediaModal({
  renderMediaPreview,
  handleClose,
  handleSend,
  isPending,
}: IMediaModalProps) {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Send Message ...
        </h2>

        <div className="flex justify-center items-center">
          {renderMediaPreview()}
        </div>

        <div className="flex justify-end gap-2">
          {!isPending && (
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSend}
            className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
