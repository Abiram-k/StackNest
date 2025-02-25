// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { ChevronLeft, ChevronRight, Heart, Search, User } from "lucide-react"
// import Link from "next/link"

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full bg-white z-50 border-b">
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-8">
//             <Link href="/" className="text-2xl font-bold">
//               <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
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
//               <Search className="h-5 w-5" />
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

//       <main className="pt-16">
//         {/* Hero Section */}
//         <section className="container mx-auto px-4 py-16 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-8">Unlock the Power of Developer Connection</h1>
//         </section>

//         {/* Make Moments Section */}
//         <section className="container mx-auto px-4 py-12">
//           <div className="grid md:grid-cols-2 gap-8 items-center">
//             <div className="relative h-[300px] md:h-[400px]">
//               <Image
//                 src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Home%20Page.jpg-uUEekOPX1JfQcS3vM2rj1g95clkR15.jpeg"
//                 alt="Developers collaborating"
//                 fill
//                 className="object-cover rounded-lg"
//               />
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold mb-4">Make Moments Memorable</h2>
//               <p className="text-gray-600 mb-6">
//                 Aliquam vel platea curabitor sit vestibulum egestas sit et lorem. Aliquat sapien ut non quis amet
//                 vestibulum ultrices amet purus feugiat
//               </p>
//               <div className="flex gap-6">
//                 <div className="text-center">
//                   <div className="text-xl font-bold text-purple-600">2k+</div>
//                   <div className="text-sm text-gray-600">Tech Events Hosted</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-xl font-bold text-purple-600">10K+</div>
//                   <div className="text-sm text-gray-600">Total Developers</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Virtual Space Section */}
//         <section className="container mx-auto px-4 py-12 bg-gray-50">
//           <div className="grid md:grid-cols-2 gap-8 items-center">
//             <div>
//               <h2 className="text-3xl font-bold mb-4">Make your virtual space</h2>
//               <p className="text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
//               <Button className="bg-purple-600 text-white hover:bg-purple-700">Create Room</Button>
//             </div>
//             <div className="relative h-[300px]">
//               <Image src="/placeholder.svg" alt="Virtual space illustration" fill className="object-contain" />
//             </div>
//           </div>
//         </section>

//         {/* Rooms Section */}
//         <section className="container mx-auto px-4 py-12">
//           <div className="grid md:grid-cols-2 gap-8">
//             {/* Trending Rooms */}
//             <div>
//               <h3 className="text-2xl font-bold mb-6">Trending Rooms</h3>
//               <div className="grid gap-4">
//                 {[1, 2].map((item) => (
//                   <Card key={item} className="p-4">
//                     <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
//                       <Image src="/placeholder.svg" alt="Event" fill className="object-cover" />
//                     </div>
//                     <h4 className="font-bold mb-2">Let you go insane</h4>
//                     <p className="text-sm text-gray-600 mb-4">
//                       Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                     </p>
//                     <Button className="bg-purple-600 text-white hover:bg-purple-700">Join Now</Button>
//                   </Card>
//                 ))}
//               </div>
//             </div>

//             {/* General Room */}
//             <div>
//               <h3 className="text-2xl font-bold mb-6">General Room</h3>
//               <Card className="p-4 bg-yellow-100">
//                 <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
//                   <Image src="/placeholder.svg" alt="General community" fill className="object-cover" />
//                 </div>
//                 <h4 className="font-bold mb-2">General Community</h4>
//                 <p className="text-sm text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
//                 <Button className="bg-purple-600 text-white hover:bg-purple-700">Join Now</Button>
//               </Card>
//             </div>
//           </div>
//         </section>

//         {/* Conference Image Section */}
//         <section className="container mx-auto px-4 py-12">
//           <div className="relative h-[400px] rounded-lg overflow-hidden">
//             <Image
//               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Home%20Page.jpg-uUEekOPX1JfQcS3vM2rj1g95clkR15.jpeg"
//               alt="Conference"
//               fill
//               className="object-cover"
//             />
//           </div>
//         </section>

//         {/* Suggested Friends Section */}
//         <section className="container mx-auto px-4 py-12">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">Suggested Friends</h2>
//             <div className="flex gap-2">
//               <Button variant="outline" size="icon" className="rounded-full">
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <Button variant="outline" size="icon" className="rounded-full">
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[1, 2, 3, 4].map((item) => (
//               <Card key={item} className="p-4">
//                 <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
//                   <Image src="/placeholder.svg" alt="Profile" fill className="object-cover" />
//                 </div>
//                 <h4 className="font-bold text-sm mb-2">Developer Name</h4>
//                 <p className="text-xs text-gray-600 mb-4">Full Stack Developer</p>
//                 <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">Connect</Button>
//               </Card>
//             ))}
//           </div>
//           <div className="text-center mt-8">
//             <Button variant="link" className="text-purple-600">
//               Explore
//             </Button>
//           </div>
//         </section>

//         {/* Subscribe Section */}
//         <section className="bg-purple-600 text-white">
//           <div className="container mx-auto px-4 py-16">
//             <div className="grid md:grid-cols-2 gap-8 items-center">
//               <div>
//                 <h2 className="text-3xl font-bold mb-4">Subscribe to premium now!</h2>
//                 <p className="mb-6">Unlock room hosting and viewing</p>
//                 <Button className="bg-white text-purple-600 hover:bg-gray-100">Subscribe</Button>
//               </div>
//               <div className="relative h-[300px]">
//                 <Image src="/placeholder.svg" alt="Mobile app" fill className="object-contain" />
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="border-t">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
//             <p className="text-sm text-gray-600">© 2024 Company Name, Inc. All rights reserved.</p>
//             <div className="flex gap-4">
//               <Link href="/terms" className="text-sm text-gray-600">
//                 Terms
//               </Link>
//               <Link href="/privacy" className="text-sm text-gray-600">
//                 Privacy
//               </Link>
//               <Link href="/support" className="text-sm text-gray-600">
//                 Support
//               </Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

