// GameplayComponent.jsx
import React from "react";
import { FaArrowLeft, FaWallet } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';

const GameplayComponent = () => {
  const { gameUrl, gameName } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-black"> {/* Fixed and full screen */}
      <div className="bg-gray-900 text-white p-2 flex justify-between items-center z-10"> {/* Added z-index */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-300"
        >
          <FaArrowLeft size={16} />
        </button>
        <h1 className="text-xl font-sans">{decodeURIComponent(gameName)}</h1>
        <button
          className="flex items-center gap-2 bg-lime-500 hover:bg-red-600 text-black rounded-md font-serif p-1.5 px-3 transition-all duration-300"
        >
          <FaWallet size={16} />
          Deposit
        </button>
      </div>
      <div className="flex-1 w-full"> {/* flex-1 to take remaining space */}
        <iframe
          src={decodeURIComponent(gameUrl)}
          title={decodeURIComponent(gameName)}
          className="w-full h-full border-0"
          allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default GameplayComponent;