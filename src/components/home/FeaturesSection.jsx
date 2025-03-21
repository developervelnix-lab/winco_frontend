import React from 'react';
import { ranabook } from '../jsondata/info';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Fast Withdrawal',
      icon: (
        <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
    {
      title: 'Instant Deposit',
      icon: (
        <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
    },
    {
      title: '1-Click Signup',
      icon: (
        <svg className="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      ),
    },
    {
      title: 'Trusted Platform',
      icon: (
        <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Why Choose {ranabook?.platformName || 'Us'}?</h2>
        <p className="text-gray-600">Experience the best features tailored for you!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="backdrop-blur-lg bg-white/70 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 shadow-md hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 p-4 rounded-full shadow-inner">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
