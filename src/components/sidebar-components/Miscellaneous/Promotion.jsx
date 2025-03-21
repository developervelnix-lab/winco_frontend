import React, { useState, useEffect } from 'react';
import { FaCrown, FaCoins } from 'react-icons/fa';
import bonus2 from '../../navbar/images/bonus2.jpg';

const PromotionCard = ({ title, subtitle, description, endDays, endHours, endMinutes, onClick }) => {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="relative h-40 md:h-48 overflow-hidden bg-black">
        <img 
          src={bonus2} 
          alt="Promotion Bonus" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 bg-gray-100 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm md:text-base">{description}</h3>
          <p className="text-gray-600 text-xs md:text-sm">Ends in {endDays} days : {endHours} hr : {endMinutes} min</p>
        </div>
        <button 
          onClick={onClick}
          className="px-4 md:px-6 py-2 md:py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-colors duration-300 text-xs md:text-base"
        >
          Read More
        </button>
      </div>
    </div>
  );
};

const WeeklyBonusCard = ({ title, type, onClick }) => {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-gray-200 gap-2 shadow-sm">
      <div className="relative h-32 md:h-40 overflow-hidden bg-black">
        <div className="absolute top-4 left-4 text-white z-10">
          <h3 className="text-lg md:text-xl font-bold mb-1">Weekly</h3>
          <p className="text-sm md:text-lg font-bold">Bonus</p>
        </div>
        <img 
          src={bonus2} 
          alt={`${type} bonus`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 bg-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 text-sm md:text-base">{title}</h3>
        <button 
          onClick={onClick}
          className="px-4 md:px-6 py-2 md:py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-colors duration-300 text-xs md:text-base"
        >
          Read More
        </button>
      </div>
    </div>
  );
};

const Promotion = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const handleReadMore = (promo) => {
    console.log(`Clicked on promotion: ${promo}`);
  };

  const renderPromotions = () => {
    const visiblePromotions = activeTab === 'all' ? 'all' : activeTab;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
        {(visiblePromotions === 'all' || visiblePromotions === 'sports') && (
          <PromotionCard
            title="Get 25% Bonus"
            subtitle="on your First Deposit"
            description="First Time Deposit Bonus"
            endDays={9}
            endHours={45}
            endMinutes={59}
            onClick={() => handleReadMore('first-deposit')}
          />
        )}
        {(visiblePromotions === 'all' || visiblePromotions === 'casino') && (
          <PromotionCard
            title="Every Deposit"
            subtitle="Wagering Bonus"
            description="Every Deposit Bonus 20%"
            endDays={325}
            endHours={14}
            endMinutes={38}
            onClick={() => handleReadMore('every-deposit')}
          />
        )}
        {(visiblePromotions === 'all' || visiblePromotions === 'sports') && (
          <WeeklyBonusCard
            title="1% Weekly Loosing Bonus On Sports"
            type="sports"
            onClick={() => handleReadMore('weekly-sports')}
          />
        )}
        {(visiblePromotions === 'all' || visiblePromotions === 'casino') && (
          <WeeklyBonusCard
            title="1% Weekly Loosing Bonus On Casino"
            type="casino"
            onClick={() => handleReadMore('weekly-casino')}
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-0 py-4">
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md bg-gray-100 p-1">
          {['all', 'sports', 'casino'].map((tab) => (
            <button 
              key={tab}
              className={`px-4 md:px-12 py-2 md:py-3 rounded-md transition-colors duration-300 ${
                activeTab === tab
                  ? 'bg-lime-400 text-gray-900 font-medium' 
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {renderPromotions()}
    </div>
  );
};

export default Promotion;