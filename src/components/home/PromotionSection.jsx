import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";

function PromotionSection() {
  const promotions = [
    { 
      title: "🔥 Welcome Bonus", 
      description: "Get 100% bonus on your first deposit!",
      buttonText: "Claim Now", 
      gradient: "from-yellow-500 to-red-600" 
    },
    { 
      title: "✨ VIP Rewards", 
      description: "Exclusive odds boost for VIP members",
      buttonText: "Join VIP", 
      gradient: "from-indigo-500 to-blue-500" 
    },
    { 
      title: "🎯 Free Bet", 
      description: "Place 5 bets and get 1 free bet!",
      buttonText: "Get Started", 
      gradient: "from-purple-500 to-pink-500" 
    },
    { 
      title: "🏆 Parlay Boost", 
      description: "10% extra on winning parlays",
      buttonText: "Bet Now", 
      gradient: "from-teal-500 to-green-500" 
    },
    {
      title: "💎 Loyalty Bonus",
      description: "Earn points & redeem exclusive rewards!",
      buttonText: "Start Earning",
      gradient: "from-pink-500 to-red-400"
    },
    {
      title: "⚡ Flash Bet Offer",
      description: "Place a bet in the next 10 mins & get 5% cashback!",
      buttonText: "Bet Fast",
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "🎉 Weekend Special",
      description: "Double rewards every Saturday & Sunday!",
      buttonText: "Check Now",
      gradient: "from-orange-400 to-pink-500"
    },
    {
      title: "🔒 Risk-Free Bet",
      description: "Get your first bet back if you lose!",
      buttonText: "Try Now",
      gradient: "from-green-500 to-lime-500"
    },
    {
      title: "🌟 Refer & Earn",
      description: "Invite friends & get ₹500 bonus each!",
      buttonText: "Refer Now",
      gradient: "from-yellow-400 to-amber-500"
    },
     
    { 
      title: "🏈 Sports Special", 
      description: "Double winnings on underdog victories",
      buttonText: "See Offers", 
      gradient: "from-orange-500 to-red-500" 
    }
  ];
 

  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    
    const scrollInterval = setInterval(() => {
      if (isPaused) return;
      
      setScrollPosition(prev => {
        const newPosition = prev + 1;
        if (newPosition >= scrollWidth - clientWidth) {
          return 0;
        }
        return newPosition;
      });
    }, 20);
    
    return () => clearInterval(scrollInterval);
  }, [isPaused]);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <section className="relative py-8 bg-gray-100">
      <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-6 tracking-wide">
        🎉 Current Promotions
      </h2>

      <div className="relative">
        {/* Gradient Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none"></div>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex space-x-6 py-4">
            {promotions.map((promo, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className={`bg-gradient-to-r ${promo.gradient} rounded-2xl p-6 text-white shadow-xl transform transition-transform duration-300 hover:scale-105 flex-shrink-0 w-72`}
              >
                <h3 className="text-xl font-bold mb-3">{promo.title}</h3>
                <p className="text-md mb-5">{promo.description}</p>
                <button className="bg-white text-gray-900 font-semibold py-2 px-5 rounded-xl hover:bg-gray-200 transition">
                  {promo.buttonText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromotionSection;
