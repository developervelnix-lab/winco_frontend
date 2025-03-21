import React from "react";
import paymode from '../navbar/images/paymode.png';

const Footer = () => {
  return (
    <footer className="bg-gray-50 rounded-lg p-4 md:p-8 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between space-y-8 md:space-y-0">
        {/* Left Section */}
        <div className="w-full md:w-1/3">
          <h2 className="font-bold text-xl mb-1">
            <span className="text-green-500">RANA</span>BOOK
          </h2>
          <p className="text-xm text-gray-700 leading-relaxed">
            <strong>Ranabook</strong> is the best platform for live and uninterrupted online
            betting for sports, Live 24hr betting with a wide spectrum of sports
            such as Cricket, Soccer, Horse Racing, Kabaddi, <strong>Aviator
            Predictor</strong>, Hockey, Basketball, <strong>Andar Bahar Game</strong> and
            many more.
          </p>
        </div>

        {/* Center Section */}
        <div className="w-full md:w-1/3 text-center">
          <h2 className="font-bold text-xl mb-2">100% Safe & Instant Payments</h2>
          <p className="text-xm text-gray-700 mb-2">
            You can make payments and receive earnings instantly via your UPI ID
            – so you can be sure that your money is safe and secure.
          </p>
          <div className="flex justify-center space-x-3 mb-2">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">18+</span>
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm">G</span>
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">GT</span>
          </div>
          <button className="mt-3 px-6 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition duration-300">
            DOWNLOAD APP
          </button>
          <p className="text-blue-600 font-semibold mt-4 text-sm">
            Gambling can be addictive, please play responsibly
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/3 text-center md:text-right">
          <h2 className="font-bold text-md mb-2">Accepted Modes Of Payments</h2>
          <div className="flex justify-center md:justify-end">
          <img
  src="https://i.postimg.cc/3w5tyBC0/paymentopt1-removebg-preview-1.png"  // Replace with your actual URL
  alt="Payment Options"
/>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="border-t border-gray-300 mt-3 pt-4 text-center">
        <div className="flex justify-center space-x-3 mb-2">
          <a href="#" className="text-blue-600 hover:text-blue-700 transition duration-300">Instagram</a>
          <a href="#" className="text-blue-600 hover:text-blue-700 transition duration-300">Facebook</a>
          <a href="#" className="text-blue-600 hover:text-blue-700 transition duration-300">Telegram</a>
          <a href="#" className="text-blue-600 hover:text-blue-700 transition duration-300">Whatsapp</a>
        </div>
        <p className="text-sm text-gray-600 mb-4">
  © Copyright 2025 Ranabook | Powered by{" "}
  <a href="https://jinkteam.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
    Jinkteam
  </a>
</p>

        <div className="flex flex-row  md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
          <a href="#" className="text-gray-600 hover:text-gray-800 transition duration-300">Responsible Gambling</a>
          <span className="hidden md:inline text-gray-400">|</span>
          <a href="#" className="text-gray-600 hover:text-gray-800 transition duration-300">Terms & Condition</a>
          <span className="hidden md:inline text-gray-400">|</span>
          <a href="#" className="text-gray-600 hover:text-gray-800 transition duration-300">KYC Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;