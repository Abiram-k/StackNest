// "use client"

// import { useState } from "react"
// import {
//   User,
//   BarChart2,
//   FileText,
//   MessageSquare,
//   Users,
//   Star,
//   Settings,
//   LogOut,
//   Bell,
//   Heart,
//   Moon,
//   Clock,
//   List,
// } from "lucide-react"
// import { Switch } from "@/components/ui/switch"
// import { Button } from "@/components/ui/button"

// export default function SettingsPage() {
//   const [darkMode, setDarkMode] = useState(true)

//   return (
//     <div className="flex min-h-screen bg-background">
//       {/* Left Sidebar */}
//       <div className="w-60 border-r flex flex-col">
//         <div className="p-4 flex justify-center">
//           <div className="bg-black rounded-full p-2 w-14 h-14 flex items-center justify-center">
//             <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
//               <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,16c-2.21,0-4-1.79-4-4 s1.79-4,4-4s4,1.79,4,4S14.21,16,12,16z" />
//             </svg>
//           </div>
//         </div>

//         <nav className="flex-1 px-4 space-y-4 py-8">
//           <NavItem icon={<User size={20} />} label="Profile" />
//           <NavItem icon={<BarChart2 size={20} />} label="Stats" />
//           <NavItem icon={<FileText size={20} />} label="Posts" />
//           <NavItem icon={<MessageSquare size={20} />} label="Rooms" />
//           <NavItem icon={<Users size={20} />} label="Friends" />
//           <NavItem icon={<Star size={20} />} label="Premium" />
//           <NavItem icon={<Settings size={20} />} label="Setting" active />
//         </nav>

//         <div className="p-4 mt-auto">
//           <button className="w-full bg-red-600 text-white py-3 rounded-md font-medium flex items-center justify-center">
//             <LogOut size={18} className="mr-2" />
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1">
//         {/* Top Navigation */}
//         <header className="h-16 border-b flex items-center justify-between px-8">
//           <nav className="flex items-center space-x-8">
//             <a href="#" className="font-medium">
//               Home
//             </a>
//             <a href="#" className="font-medium">
//               About
//             </a>
//             <a href="#" className="font-medium">
//               Daily Challenge
//             </a>
//             <a href="#" className="font-medium">
//               Highlights
//             </a>
//             <a href="#" className="font-medium">
//               Contact us
//             </a>
//           </nav>

//           <div className="flex items-center space-x-4">
//             <button className="p-2">
//               <Bell size={22} />
//             </button>
//             <button className="p-2">
//               <Heart size={22} fill="currentColor" className="text-red-500" />
//             </button>
//             <button className="p-2">
//               <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                 <User size={18} />
//               </div>
//             </button>
//           </div>
//         </header>

//         {/* Settings Content */}
//         <div className="max-w-3xl mx-auto py-16 px-4">
//           <h1 className="text-2xl font-bold mb-12 text-center">Settings</h1>

//           <div className="space-y-10">
//             {/* Theme Setting */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-start space-x-4">
//                 <div className="p-2 bg-gray-100 rounded-full dark:bg-gray-800">
//                   <Moon size={24} className="text-gray-700 dark:text-gray-300" />
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-lg mb-1">Change theme</h3>
//                   <p className="text-muted-foreground text-sm">Switch it up! Change your app theme for a fresh look.</p>
//                 </div>
//               </div>
//               <Switch checked={darkMode} onCheckedChange={setDarkMode} />
//             </div>

//             {/* Language Setting */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-start space-x-4">
//                 <div className="p-2 bg-gray-100 rounded-full dark:bg-gray-800">
//                   <Clock size={24} className="text-gray-700 dark:text-gray-300" />
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-lg mb-1">Change Language</h3>
//                   <p className="text-muted-foreground text-sm">All details will reset except username</p>
//                 </div>
//               </div>
//               <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white border-0">
//                 Choose
//               </Button>
//             </div>

//             {/* Password Setting */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-start space-x-4">
//                 <div className="p-2 bg-gray-100 rounded-full dark:bg-gray-800">
//                   <List size={24} className="text-gray-700 dark:text-gray-300" />
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-lg mb-1">Change Password</h3>
//                   <p className="text-muted-foreground text-sm">All details will reset except username</p>
//                 </div>
//               </div>
//               <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white border-0">
//                 Change
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Navigation Item Component
// function NavItem({ icon, label, active = false }) {
//   return (
//     <a
//       href="#"
//       className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
//         active
//           ? "bg-indigo-600 text-white"
//           : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
//       }`}
//     >
//       {icon}
//       <span className="font-medium">{label}</span>
//     </a>
//   )
// }

