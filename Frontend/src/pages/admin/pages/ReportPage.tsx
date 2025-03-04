// import { LayoutGrid, User, ShoppingBag, Flag, CreditCard, BarChart2, Bell, FileText, Globe, LogOut } from "lucide-react"
// import Image from "next/image"

// export default function ReportsPage() {
//   return (
//     <div className="flex h-screen bg-white">
//       {/* Sidebar */}
//       <div className="w-64 border-r border-gray-200 flex flex-col">
//         <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
//           <NavItem icon={<LayoutGrid size={20} />} label="Dashboard" />
//           <NavItem icon={<User size={20} />} label="Users" />
//           <NavItem icon={<ShoppingBag size={20} />} label="Premium Plans" />
//           <NavItem icon={<Flag size={20} />} label="Banners" />
//           <NavItem icon={<LayoutGrid size={20} />} label="Rooms" />
//           <NavItem icon={<CreditCard size={20} />} label="Payments" />
//           <NavItem icon={<BarChart2 size={20} />} label="Daily challenge" />
//           <NavItem icon={<Bell size={20} />} label="Notifications" />
//           <NavItem icon={<FileText size={20} />} label="Reports" active />
//           <NavItem icon={<Globe size={20} />} label="Feeds" />
//         </div>
//         <div className="p-4">
//           <button className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md transition-colors">
//             <LogOut size={18} className="mr-2" />
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-8">
//           <h1 className="text-2xl font-bold mb-8">Reports</h1>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Array(6)
//               .fill(0)
//               .map((_, i) => (
//                 <ReportCard key={i} />
//               ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// function NavItem({ icon, label, active = false }) {
//   return (
//     <div
//       className={`flex items-center px-4 py-3 rounded-md cursor-pointer ${
//         active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
//       }`}
//     >
//       <div className="mr-3">{icon}</div>
//       <span className="font-medium">{label}</span>
//     </div>
//   )
// }

// function ReportCard() {
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
//       <div className="flex items-start space-x-4">
//         <Image
//           src="/placeholder.svg?height=64&width=64"
//           alt="Jenny Wilson"
//           width={64}
//           height={64}
//           className="rounded-full"
//         />
//         <div className="flex-1">
//           <div className="flex justify-between items-start">
//             <h3 className="font-semibold text-lg">Jenny Wilson</h3>
//             <span className="text-red-500 text-sm">1 min ago</span>
//           </div>

//           <p className="text-gray-600 text-sm mt-1 mb-4">Guy Hawkins, Robert Fox and 3 other mutual friends</p>

//           <div className="flex space-x-3">
//             <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
//               Accept
//             </button>
//             <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md text-sm font-medium transition-colors">
//               Reject
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

