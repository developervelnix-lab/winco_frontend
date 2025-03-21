import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import all provider images (converted to lowercase)
import bf from './providers/bf.png';
import bggaming from './providers/bggaming.png';
import bigtiminggaming from './providers/bigtiminggaming.png';
import caleta from './providers/Caleta.png'
import boominggames from './providers/boominggames.png';
import booongo from './providers/Booongo.png'
import cq9 from './providers/CQ9.png';
import endorphina from './providers/endorphina.png';
import evolution from './providers/Evolution.png';
import evoplay from './providers/Evoplay.png';
import gameart from './providers/gameart.png';
import pgsoft from './providers/PGSOFT.png';
import playngo from './providers/PlayNGo.png';
import playson from './providers/playson.png';
import playtech from './providers/PlayTech.png';
import pragmaticplay from './providers/PragmaticPlay.png';
import relaxgaming from './providers/relaxgaming.png';
import redtiger from './providers/redtiger.png';
import saba from './providers/sabalogo.png';
import skywind from './providers/Skywind.png';
import v8 from './providers/V8.png';
import yesgaming from './providers/yesgaming.png';
import rubyplay from './providers/RubyPlay.png';

const gameproviders = [
  { "logo": bf },
  { "logo": bggaming },
  { "logo": bigtiminggaming },
  { "logo": boominggames },
  { "logo": booongo },
  { "logo": caleta },
  { "logo": cq9 },
  { "logo": endorphina },
  { "logo": evolution },
  { "logo": evoplay },
  { "logo": gameart },
  { "logo": pgsoft },
  { "logo": playngo },
  { "logo": playson },
  { "logo": playtech },
  { "logo": pragmaticplay },
  { "logo": relaxgaming },
  { "logo": redtiger },
  { "logo": saba },
  { "logo": skywind },
  { "logo": v8 },
  { "logo": yesgaming },
  { "logo": rubyplay }


]

const GameProvider = () => {
  // Check if gameproviders is properly imported


  // If gameproviders is undefined or empty, provide a fallback
  const gameProviders = gameproviders || [];

  const [showAll, setShowAll] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;

  // Add this check to prevent errors if gameProviders is empty
  const visibleProviders = gameProviders.length ? (
    showAll
      ? gameProviders
      : gameProviders.slice(startIndex, startIndex + itemsPerPage)
  ) : [];

  const scrollLeft = () => {
    if (startIndex > 0) setStartIndex(startIndex - itemsPerPage);
  };

  const scrollRight = () => {
    if (startIndex + itemsPerPage < gameProviders.length) setStartIndex(startIndex + itemsPerPage);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      {/* Header with Title & Navigation */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#FFFFFF] text-md font-serif">🎰 Games Providers</h2>
        <div className="flex items-center space-x-3">
          {!showAll && (
            <>
              <button
                onClick={scrollLeft}
                disabled={startIndex === 0}
                className={`p-2 rounded-full ${startIndex === 0 ? "opacity-50 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"
                  }`}
              >
                <FaChevronLeft size={18} />
              </button>
              <button
                onClick={scrollRight}
                disabled={startIndex + itemsPerPage >= gameProviders.length}
                className={`p-2 rounded-full ${startIndex + itemsPerPage >= gameProviders.length
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
                  }`}
              >
                <FaChevronRight size={18} />
              </button>
            </>
          )}
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-red-500 font-medium hover:underline"
          >
            {showAll ? "See Less" : "See All"}
          </button>
        </div>
      </div>

      {/* Grid of Providers */}
      <div className={`grid gap-3 transition-all duration-300 ${showAll ? "grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-8" : "grid-cols-3 sm:grid-cols-4"}`}>
        {visibleProviders.length > 0 ? (
          visibleProviders.map((provider, index) => (
            <Card key={index} logo={provider.logo} />
          ))
        ) : (
          <div className="col-span-full text-center text-white py-10">
            No game providers available
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ logo }) => {
  return (
    <div className="w-full h-[100px] bg-white rounded-lg shadow-md flex items-center justify-center p-3 hover:shadow-xl hover:scale-105 transition-all">
      <img
        src={logo}
        alt="Provider Logo"
        className="max-w-full max-h-full object-contain"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/150?text=Logo";
        }}
      />
    </div>
  );
};

export default GameProvider;