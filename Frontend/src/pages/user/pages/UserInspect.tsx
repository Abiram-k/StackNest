import { FallBackTable } from "@/components/FallBackTable";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserInspect } from "@/hooks/user/userProfile/useGetUserInspect";
import { Eye, Heart, MessageCircleIcon, SparklesIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function UserInspect() {
  const { userName } = useParams<{ userName: string }>();
  const navigate = useNavigate();
  if (!userName) navigate(-1);
  const { data, isPending } = useGetUserInspect(userName!);
  console.log("UserData: ", data);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50  my-30">
      {isPending && <Spinner />}
      <div className="container mx-auto px-4 -mt-16 md:-mt-20 flex flex-col md:flex-row gap-8">
        {/* Profile Section */}
        <div className="md:w-1/3 lg:w-1/4 flex flex-col items-center bg-white rounded-lg shadow-md p-6 z-10">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4">
            <img
              src={
                data?.userData.avatar ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              alt="Profile"
              width={160}
              height={160}
              className="rounded-full border-4 border-white"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {data?.userData.userName || "No name"}
          </h1>
          <p className="text-gray-600 mb-6">
            {data?.userData.description || ""}
          </p>

          <div className="flex justify-between w-full mb-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-indigo-600">
                {data?.userData.connectionCount}
              </span>
              <span className="text-sm text-gray-600">Connections</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-indigo-600">
                {data?.userData.feedsCount}
              </span>
              <span className="text-sm text-gray-600">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-indigo-600">
                {data?.userData.streakCount}{" "}
              </span>
              <span className="text-sm text-gray-600">Streak</span>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <button className="w-1/2 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
              Message
            </button>
            <button className="w-1/2 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
              Connect
            </button>
          </div>
        </div>

        <div className="md:w-2/3 lg:w-3/4 bg-white rounded-lg shadow-md p-6">
          <div className="flex border-b mb-6">
            <button className="px-4 py-2 text-indigo-600 border-b-2 border-indigo-600 font-medium">
              Posts
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.feedData.length ? (
              data?.feedData.map((item) => (
                <div
                  key={item.feedId}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {item.media ? (
                      item.media.endsWith(".mp4") ? (
                        <video
                          controls
                          className="w-full h-full object-cover"
                          src={item.media}
                          title={item.title}
                        />
                      ) : (
                        <img
                          src={item.media}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">No media</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.content}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <HeartIcon className="w-4 h-4 mr-1 text-red-500" />
                          <span>{item.likesCount}</span>
                        </div>
                        <div className="flex items-center">
                          <ChatBubbleIcon className="w-4 h-4 mr-1 text-blue-500" />
                          <span>{item.commentsCount}</span>
                        </div>
                        <div className="flex items-center">
                          <EyeIcon className="w-4 h-4 mr-1 text-green-500" />
                          <span>{item.viewsCount}</span>
                        </div>
                        <div className="flex items-center text-indigo-600 hover:underline text-sm font-medium">
                          <Link to={`/user/highlights/${item.feedId}`}>
                            View Post →
                          </Link>
                        </div>
                      </div>
                      <span className="text-xs">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <SparklesIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    When {data?.userData.userName || "this user"} shares
                    updates, they'll appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const HeartIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    {/* Heart icon path */}
    <Heart />
  </svg>
);

const ChatBubbleIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    {/* Chat bubble icon path */}
    <MessageCircleIcon />
  </svg>
);

const EyeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    {/* Eye icon path */}
    <Eye />
  </svg>
);
