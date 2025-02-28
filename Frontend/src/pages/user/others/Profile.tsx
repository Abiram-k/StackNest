import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Mail } from "lucide-react";
import SideBar from "@/components/SideBar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex pt-16">
        <SideBar />
        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Check-in Section */}
            <div className="mb-8">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white mb-2">
                Check in
              </Button>
              <p className="text-sm text-gray-600">
                Check in daily to maintain your streak and stay on the
                leaderboard!
                <br />
                Keep your progress going and secure your top spot.
              </p>
            </div>

            {/* Profile Section */}
            <div className="relative mb-8">
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-0 top-0"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile%20page-bnUhjDgqGaHbT5sgsn21mQ2fqufpce.png"
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">Alexa Rawles</h2>
                  <p className="text-gray-600">alexarawles@gmail.com</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="Your First Name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Gender</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mobile</label>
                    <Input placeholder="Enter mobile number" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">User Name</label>
                    <Input placeholder="Enter you Nick name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Country</label>
                    <Input placeholder="Your First Name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Describe Yourself..." />
                  </div>
                </div>
              </div>

              {/* Verification Sections */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">My email Address</h3>
                    <p className="text-sm text-gray-600">
                      alexarawles@gmail.com
                    </p>
                    <p className="text-xs text-gray-500">1 month ago</p>
                  </div>
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">My mobile number</h3>
                    <p className="text-sm text-gray-600">+91 6282004567</p>
                    <p className="text-xs text-gray-500">1 month ago</p>
                  </div>
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
