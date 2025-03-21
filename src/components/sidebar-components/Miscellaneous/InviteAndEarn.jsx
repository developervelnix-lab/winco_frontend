import React, { useState, useEffect } from 'react';
import { FaCopy, FaShareAlt, FaGift } from 'react-icons/fa';
import { Toast } from 'flowbite-react';
import { HiCheck } from 'react-icons/hi';

const InviteAndEarn = () => {
  const referralCode = '917300000000';
  const referralURL = `https://ranabook.com/home?referralcode=${referralCode}`;
  const [showToast, setShowToast] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10 relative">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-10 relative">

        {/* Flowbite Toast */}
        {showToast && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">Copied to clipboard!</div>
              <Toast.Toggle />
            </Toast>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-yellow-100 p-4 rounded-full mb-4">
            <FaGift className="text-4xl text-yellow-400" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-800">Refer Friends & Earn Rewards</h1>
          <p className="text-sm md:text-lg text-gray-600">
            Share your referral code and earn <span className="font-semibold text-yellow-500">20%</span> of every friend's deposit!
          </p>
        </div>

        {/* Earnings */}
        <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center gap-3 mb-6">
          <FaGift className="text-xl text-yellow-500" />
          <span className="text-sm md:text-base font-medium text-gray-700">Your Earnings: ₹0.00</span>
        </div>

        {/* Referral Section */}
        <div className="space-y-4">

          {/* Referral Link */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <FaShareAlt className="text-lg text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Your Referral Link</span>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={referralURL}
                readOnly
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base text-gray-800"
              />
              <button
                onClick={() => handleCopy(referralURL)}
                className="flex items-center justify-center gap-1 bg-yellow-400 hover:bg-yellow-500 transition-colors text-white px-4 py-2 rounded-lg text-sm md:text-base"
              >
                <FaCopy /> Copy
              </button>
            </div>
          </div>

          {/* Referral Code */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Your Unique Code</span>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <span className="flex-1 font-mono text-lg font-bold tracking-wider text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-center md:text-left">
                {referralCode}
              </span>
              <button
                onClick={() => handleCopy(referralCode)}
                className="flex items-center justify-center gap-1 bg-yellow-400 hover:bg-yellow-500 transition-colors text-white px-4 py-2 rounded-lg text-sm md:text-base"
              >
                <FaCopy /> Copy
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Share your link → Friends sign up → You earn rewards!</p>
          <p className="mt-2 text-xs">*Terms and conditions apply</p>
        </div>
      </div>
    </div>
  );
};

export default InviteAndEarn;
