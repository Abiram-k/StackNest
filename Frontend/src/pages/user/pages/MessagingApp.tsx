import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Paperclip,
  Send,
  Mic,
  Video,
  ArrowLeft,
  MoreHorizontal,
  CheckCheck,
  Eye,
  Trash,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/optimizational/useDebounce";
import { useGetFreinds } from "@/hooks/user/connection/useGetFreinds";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";
import { useGetMessages } from "@/hooks/user/connection/message/useGetMessages";
import { useSendMessage } from "@/hooks/user/connection/message/useSendMessage";
import { toast } from "sonner";
import { useSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ImageUploader";
import { HttpService } from "@/api/httpService";
import { ImageService } from "@/api/public/imageService";
import { useMessageSeenObserver } from "@/hooks/user/connection/message/useMessageSeenObserver";
import { useGetUnreadMessagesCount } from "@/hooks/user/connection/message/useGetUnreadMessageCount";

interface MsgUser {
  _id: string;
  name: string;
  avatar: string;
}
interface MessageChat {
  id: string;
  senderId: string;
  message: string;
  type: "text" | "image" | "video";
  isRead: boolean;
}
type GetMessageRes = {
  friendData: MsgUser;
  userData: MsgUser;
  messages: MessageChat[];
};

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

  const { data: messageDataAPI } = useGetMessages(friendId);

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
  return (
    <>
      <div className="md:flex flex-col max-h-screen bg-white dark:bg-black  hidden scrollbar-thin overflow-hidden h-screen p-3  border-b-2 border-gray-200  ">
        <div className="flex flex-1 overflow-hidden">
          <FreindsList />

          {friendId ? (
            <div className="hidden md:flex flex-1 flex-col ">
              {/*  Header */}
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
                    <h3 className="font-medium">
                      {messageData?.friendData?.name || "No name"}
                    </h3>
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
                  <button className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-900 dark:text-white rounded-md text-gray-700 hover:bg-gray-200">
                    <Mic className="h-5 w-5 mr-1" />
                    <span>VoiceCall</span>
                  </button>
                  <button className="flex items-center px-3 py-1.5 bg-blue-50 dark:bg-gray-900  rounded-md text-blue-600 hover:bg-blue-100">
                    <Video className="h-5 w-5 mr-1" />
                    <span>VideoCall</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messageData?.messages.map((message) => {
                  return message.senderId == friendId &&
                    message.senderId !== messageData.userData._id ? (
                    <FrienMessageComponent
                      key={message.id}
                      avatar={messageData.friendData.avatar}
                      friendId={messageData.friendData._id}
                      message={message}
                      name={messageData.friendData.name}
                      // setLocalIsReadTrue={setLocalIsReadTrue}
                    />
                  ) : (
                    <div className="flex justify-end " key={message.id}>
                      <div className="relative min-w-32 ">
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
                          <Trash className="h-3 w-3 text-red-500 absolute right-3 top-1 z-30 cursor-pointer" />

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

function FrienMessageComponent({
  friendId,
  message,
  name,
  avatar,
}: // setLocalIsReadTrue,
{
  message: MessageChat;
  name: string;
  friendId: string;
  avatar: string;
  // setLocalIsReadTrue: (messageId: string) => void;
}) {
  const messageSeenRef = useMessageSeenObserver({
    friendId,
    messageId: message.id,
    isRead: message.isRead,
    // onSeen: () => setLocalIsReadTrue(message.id),
  });
  return (
    <div className="flex items-start" key={message.id}>
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
  // setLocalIsReadTrue: (messageId: string) => void;
}) {
  const messageSeenRef = useMessageSeenObserver({
    friendId,
    messageId: message.id,
    isRead: message.isRead,
    // onSeen: () => setLocalIsReadTrue(message.id),
  });
  return (
    <div className="flex items-start" key={message.id}>
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
    </div>
  );
}

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

  return (
    <>
      {friendId ? (
        <div className="flex flex-col  bg-white dark:bg-black h-screen scrollbar-thin">
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
                <h3 className="font-medium">{messageData?.friendData.name}</h3>
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
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Mic className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Video className="h-5 w-5" />
              </button>
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
                <div className=" relative flex justify-end" key={message.id}>
                  <div
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
                  </div>
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
            placeholder="Search Friends"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex mt-4 border-b pb-2">
          <button className="flex-1 flex justify-center py-2 border-b-2 border-blue-600">
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
          <button className="flex-1 flex justify-center py-2 text-gray-500">
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

      <div className="overflow-y-auto flex-1">
        {friendsData?.friends.length ? (
          friendsData?.friends.map((friend, index) => (
            <div
              key={`${friend.friendId}-${index}`}
              className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer border-b"
              onClick={() =>
                navigate(`/user/messaging?friend=${friend.friendId}`)
              }
            >
              <img
                src={friend.avtar}
                alt="User Avatar"
                width={50}
                height={50}
                className="rounded-full mr-3"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {friend.firstName}
                  </h3>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      {friend.lastMessageAt
                        ? formatDistanceToNow(new Date(friend.lastMessageAt)) +
                          " ago"
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
