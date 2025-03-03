"use client";

import { useState } from "react";
import {
  LayoutGrid,
  Users,
  CreditCard,
  Flag,
  Home,
  DollarSign,
  Calendar,
  Bell,
  FileText,
  Globe,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CustomTable from "@/components/CustomTable";
import { Pagination } from "@/components/ui/pagination";
// import { Switch } from "@/components/ui/switch"

const UserManagement = () => {
  const [activeNav, setActiveNav] = useState("Users");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { name: "Dashboard", icon: <LayoutGrid className="w-5 h-5" /> },
    { name: "Users", icon: <Users className="w-5 h-5" /> },
    { name: "Premium Plans", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Banners", icon: <Flag className="w-5 h-5" /> },
    { name: "Rooms", icon: <Home className="w-5 h-5" /> },
    { name: "Payments", icon: <DollarSign className="w-5 h-5" /> },
    { name: "Daily challenge", icon: <Calendar className="w-5 h-5" /> },
    { name: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { name: "Reports", icon: <FileText className="w-5 h-5" /> },
    { name: "Feeds", icon: <Globe className="w-5 h-5" /> },
  ];

  // Sample user data
  const userData = [
    {
      id: 1,
      name: "Ananthu1",
      email: "user1@email.com",
      phone: "9656123456",
      blocked: false,
    },
    {
      id: 2,
      name: "Ananthu2",
      email: "user2@email.com",
      phone: "9656123456",
      blocked: false,
    },
    {
      id: 3,
      name: "Ananthu3",
      email: "user3@email.com",
      phone: "9656123456",
      blocked: false,
    },
    {
      id: 4,
      name: "Ananthu4",
      email: "user4@email.com",
      phone: "9656123456",
      blocked: false,
    },
    {
      id: 5,
      name: "Ananthu5",
      email: "user5@email.com",
      phone: "9656123456",
      blocked: false,
    },
    {
      id: 6,
      name: "Ananthu6",
      email: "user6@email.com",
      phone: "9656123456",
      blocked: false,
    },
    {
      id: 7,
      name: "Ananthu7",
      email: "user7@email.com",
      phone: "9656123456",
      blocked: false,
    },
    {
      id: 8,
      name: "Ananthu8",
      email: "user8@email.com",
      phone: "9656123456",
      blocked: false,
    },
    {
      id: 9,
      name: "Ananthu9",
      email: "user9@email.com",
      phone: "9656123456",
      blocked: false,
    },
  ];

  const [users, setUsers] = useState(userData);

  // Toggle user block status
  const toggleBlockStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, blocked: !user.blocked } : user
      )
    );
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1  p-8">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
          User Management
        </h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Friends"
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort</span>
              <select className="border rounded-lg px-3 py-2 bg-white">
                <option>Name</option>
                <option>Email</option>
                <option>ID</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Filter</span>
              <select className="border rounded-lg px-3 py-2 bg-white">
                <option>Select</option>
                <option>Blocked</option>
                <option>Unblocked</option>
              </select>
            </div>
          </div>
        </div>

        <CustomTable />
        {/* Users Table */}
        {/* <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-center">Block/Unblock</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      <Switch 
                        checked={!user.blocked} 
                        onCheckedChange={() => toggleBlockStatus(user.id)}
                        className="data-[state=checked]:bg-green-500"
                      /> 
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>  */}

<Pagination/>
        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-1">
            <button className="p-2 rounded-md bg-gray-200 text-gray-600">
              <ChevronLeft className="h-4 w-4" />
            </button>

            {[1, 2, "...", 9, 10].map((page, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md ${
                  page === 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
