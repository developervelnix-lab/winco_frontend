import React from "react";
import { Flame, Star, Square, Fish, Video, Trophy } from "lucide-react";

const TrendingSlot = () => {
  const trendingCategories = [
    { name: "Hot", gradient: "from-red-500 to-orange-500", icon: <Flame size={30} /> },
    { name: "Slot", gradient: "from-yellow-400 to-pink-500", icon: <Star size={30} /> },
    { name: "Card", gradient: "from-indigo-500 to-blue-500", icon: <Square size={30} /> },
    { name: "Fishing", gradient: "from-purple-500 to-pink-500", icon: <Fish size={30} /> },
    { name: "Live", gradient: "from-teal-500 to-green-500", icon: <Video size={30} /> },
    { name: "Sports", gradient: "from-orange-500 to-red-500", icon: <Trophy size={30} /> },
  ];

  return (
    <div className="bg-gradient-to-br from-black to-gray-900 rounded-xl p-6 sm:p-10 shadow-2xl border-2 border-yellow-400 relative overflow-hidden">
      <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 text-center mb-8 uppercase tracking-wider">
        🎰 Trending Slots 🎲
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {trendingCategories.map((category, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${category.gradient} p-4 rounded-lg text-white text-center shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-1`}
          >
            <div className="flex justify-center mb-2 animate-pulse">{category.icon}</div>
            <h3 className="text-lg sm:text-xl font-semibold">{category.name}</h3>
            <p className="text-xs sm:text-sm opacity-90 mt-1">Explore {category.name}</p>
          </div>
        ))}
      </div>

      {/* Subtle glowing effect */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-400 opacity-10 rounded-full blur-3xl animate-ping"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-500 opacity-10 rounded-full blur-3xl animate-ping"></div>
    </div>
  );
};

export default TrendingSlot;
