// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Bell,
//   Edit2,
//   Heart,
//   Home,
//   LogOut,
//   Mail,
//   Settings,
//   Users,
//   User,
//   BarChart2,
//   FileText,
//   Layout,
//   Crown,
// } from "lucide-react"
// import Link from "next/link"

// export default function ProfilePage() {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full bg-white z-50 border-b">
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-8">
//             <Link href="/" className="text-2xl font-bold">
//               <Image
//                 src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile%20page-bnUhjDgqGaHbT5sgsn21mQ2fqufpce.png"
//                 alt="Logo"
//                 width={40}
//                 height={40}
//                 className="rounded-full"
//               />
//             </Link>
//             <div className="hidden md:flex items-center space-x-6">
//               <Link href="/" className="text-sm font-medium">
//                 Home
//               </Link>
//               <Link href="/about" className="text-sm font-medium">
//                 About
//               </Link>
//               <Link href="/challenge" className="text-sm font-medium">
//                 Daily Challenge
//               </Link>
//               <Link href="/highlights" className="text-sm font-medium">
//                 Highlights
//               </Link>
//               <Link href="/contact" className="text-sm font-medium">
//                 Contact us
//               </Link>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon">
//               <Bell className="h-5 w-5" />
//             </Button>
//             <Button variant="ghost" size="icon">
//               <Heart className="h-5 w-5" />
//             </Button>
//             <Button variant="ghost" size="icon">
//               <User className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//       </nav>

//       <div className="flex pt-16">
//         {/* Sidebar */}
//         <aside className="fixed left-0 w-64 h-[calc(100vh-4rem)] border-r bg-white">
//           <nav className="p-4 space-y-2">
//             <Link
//               href="/profile"
//               className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg bg-purple-100 text-purple-600"
//             >
//               <Home className="h-5 w-5" />
//               Profile
//             </Link>
//             <Link
//               href="/stats"
//               className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <BarChart2 className="h-5 w-5" />
//               Stats
//             </Link>
//             <Link
//               href="/posts"
//               className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <FileText className="h-5 w-5" />
//               Posts
//             </Link>
//             <Link
//               href="/rooms"
//               className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <Layout className="h-5 w-5" />
//               Rooms
//             </Link>
//             <Link
//               href="/friends"
//               className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <Users className="h-5 w-5" />
//               Friends
//             </Link>
//             <Link
//               href="/premium"
//               className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <Crown className="h-5 w-5" />
//               Premium
//             </Link>
//             <Link
//               href="/settings"
//               className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <Settings className="h-5 w-5" />
//               Setting
//             </Link>
//           </nav>
//           <div className="absolute bottom-0 w-full p-4">
//             <Button variant="destructive" className="w-full">
//               <LogOut className="h-5 w-5 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 ml-64 p-8">
//           <div className="max-w-3xl mx-auto">
//             {/* Check-in Section */}
//             <div className="mb-8">
//               <Button className="bg-amber-500 hover:bg-amber-600 text-white mb-2">Check in</Button>
//               <p className="text-sm text-gray-600">
//                 Check in daily to maintain your streak and stay on the leaderboard!
//                 <br />
//                 Keep your progress going and secure your top spot.
//               </p>
//             </div>

//             {/* Profile Section */}
//             <div className="relative mb-8">
//               <Button variant="secondary" size="sm" className="absolute right-0 top-0">
//                 <Edit2 className="h-4 w-4 mr-2" />
//                 Edit
//               </Button>

//               <div className="flex items-center gap-4 mb-6">
//                 <Image
//                   src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile%20page-bnUhjDgqGaHbT5sgsn21mQ2fqufpce.png"
//                   alt="Profile"
//                   width={80}
//                   height={80}
//                   className="rounded-full"
//                 />
//                 <div>
//                   <h2 className="text-xl font-semibold">Alexa Rawles</h2>
//                   <p className="text-gray-600">alexarawles@gmail.com</p>
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium">Full Name</label>
//                     <Input placeholder="Your First Name" />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium">Gender</label>
//                     <Select>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select your Gender" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="male">Male</SelectItem>
//                         <SelectItem value="female">Female</SelectItem>
//                         <SelectItem value="other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium">Mobile</label>
//                     <Input placeholder="Enter mobile number" />
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium">User Name</label>
//                     <Input placeholder="Enter you Nick name" />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium">Country</label>
//                     <Input placeholder="Your First Name" />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium">Description</label>
//                     <Textarea placeholder="Describe Yourself..." />
//                   </div>
//                 </div>
//               </div>

//               {/* Verification Sections */}
//               <div className="mt-8 space-y-4">
//                 <div className="flex items-center justify-between p-4 border rounded-lg">
//                   <div>
//                     <h3 className="font-medium">My email Address</h3>
//                     <p className="text-sm text-gray-600">alexarawles@gmail.com</p>
//                     <p className="text-xs text-gray-500">1 month ago</p>
//                   </div>
//                   <Mail className="h-5 w-5 text-blue-500" />
//                 </div>
//                 <div className="flex items-center justify-between p-4 border rounded-lg">
//                   <div>
//                     <h3 className="font-medium">My mobile number</h3>
//                     <p className="text-sm text-gray-600">+91 6282004567</p>
//                     <p className="text-xs text-gray-500">1 month ago</p>
//                   </div>
//                   <Mail className="h-5 w-5 text-blue-500" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

