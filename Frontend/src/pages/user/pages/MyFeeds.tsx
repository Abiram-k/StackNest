import { Button } from "@/components/ui/button";
import { useGetMyFeeds } from "@/hooks/feeds/useGetMyFeeds";
import {
  ChevronDown,
  Heart,
  MessageSquare,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MyFeeds = () => {
  const navigate = useNavigate();
  const { data } = useGetMyFeeds();
  console.log("My Feeds data: ", data);
  return (
    <main className="max-w-3xl mx-auto py-8 px-4 md:-ms-1">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Your Feeds</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            onClick={() => navigate("/user/profile/feed/upload")}
          >
            <Plus className="h-5 w-5" />
            <span>Add New Post</span>
          </Button>

          <div className="relative">
            <button className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-1">
              <span>Filter</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src="/placeholder.svg?height=40&width=40"
                alt="Dami Soyombo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-medium">Dami Soyombo</h3>
                <p className="text-sm text-gray-500">4 days ago</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button>
                <Pencil className="h-5 w-5 text-blue-500 " />
              </button>
              <button>
                <Trash2 className="h-5 w-5 text-red-500 " />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2">
              Congratulations to Hamoye Data Science Internship Stage C Winners!
            </p>
            <p className="text-gray-600">
              The collapse of the online-advertising market in 2001 made
              marketing on the Internet seem even less compelling. Website
              usability, press releases.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-gray-500">
            <button className="flex items-center space-x-1">
              <Heart className="h-5 w-5" />
              <span className="text-sm">Like 30</span>
            </button>
            <button className="flex items-center space-x-1">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">Comment</span>
            </button>
            <div className="ml-auto">
              <button className="text-sm">Reply</button>
            </div>
          </div>
        </div>

        {/* Post 2 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src="/placeholder.svg?height=40&width=40"
                alt="Hamoye Team"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-medium">Hamoye Team</h3>
                <p className="text-sm text-gray-500">1 week ago</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button>
                <Pencil className="h-5 w-5 text-gray-500" />
              </button>
              <button>
                <Trash2 className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2">
              New course uploaded collapse of the online-advertising market in
              2001 made marketing on the Internet seem even less compelling.
              Website usability, press releases.
            </p>

            <div className="mt-4 mb-4">
              <img
                src="/placeholder.svg?height=300&width=600"
                alt="Coastal sunset"
                width={600}
                height={300}
                className="rounded-lg w-full h-auto object-cover"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-1">
                Make Money Online Through Advertising
              </h4>
              <p className="text-gray-600 text-sm">
                It is probably the dream of any amateur astronomer to be able to
                be the boss of one of the great multi million dollar telescopes
                even if it was just.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-gray-500">
            <button className="flex items-center space-x-1">
              <Heart className="h-5 w-5" />
              <span className="text-sm">Like 30</span>
            </button>
            <button className="flex items-center space-x-1">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">Comment</span>
            </button>
            <div className="ml-auto">
              <button className="text-sm">Reply</button>
            </div>
          </div>
        </div>

        {/* Post 3 (just showing the beginning) */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src="/placeholder.svg?height=40&width=40"
                alt="Dami Soyombo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-medium">Dami Soyombo</h3>
                <p className="text-sm text-gray-500">4 days ago</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button>
                <Pencil className="h-5 w-5 text-gray-500" />
              </button>
              <button>
                <Trash2 className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyFeeds;
