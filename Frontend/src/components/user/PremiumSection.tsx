import { useNavigate } from "react-router-dom";

export default function PremiumBanner() {
  const navigate = useNavigate();
  return (
    <div className="relative w-full bg-gradient-to-br from-purple-700 to-purple-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between relative">
        <div
          className="absolute left-0 top-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl"
          style={{ transform: "translate(-50%, -50%)" }}
        />

        <div className="text-center md:text-left z-10 mb-8 md:mb-0">
          <h3 className="text-purple-200 text-sm md:text-base tracking-wide uppercase mb-2">
            START ROOM HOSTING NOW
          </h3>
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Subscribe to premium now!
          </h2>
          <p className="text-purple-100 mb-6">
            Unlock room hosting and viewing
          </p>
          <button
            onClick={() => navigate("/user/profile/premium-plans")}
            className="bg-purple-500 animate-bounce hover:animate-none hover:bg-purple-400 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200 cursor-pointer"
          >
            Subscribe
          </button>
        </div>

        <div className="relative">
          <div className="relative transform rotate-12 translate-x-8">
            <PhoneMockup />
          </div>
          <div className="absolute top-8 -left-8 transform -rotate-6">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="w-48 h-40 bg-white/90 rounded-3xl p-3 shadow-xl">
      <div className="w-full h-full bg-gray-50 rounded-2xl relative overflow-hidden">
        <div className="grid grid-cols-2 gap-3 p-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-100 rounded-lg relative"
            >
              <div className="absolute w-2 h-2 bg-yellow-400 rounded-full top-2 right-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
