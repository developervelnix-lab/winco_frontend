import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaWallet, FaMoneyBillWave, FaCoins } from "react-icons/fa"; // Import icons

const AccountInfo = ({ accountInfo }) => {
  const navigate = useNavigate();

  return (
    <div className="w-[98%] bg-white shadow-md flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-1 border-b">
        <div className="flex items-center pb-1">
          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-md border border-gray-200 mr-3">
            <FaUser className="w-5 h-5 text-red-500" /> {/* Username Icon */}
          </div>
          <span className="text-lg text-black font-sans">
            {accountInfo.account_username}
          </span>
        </div>
      </div>

      {/* Balance Info */}
      <div className="p-2 border-b flex-1 overflow-y-auto">
        <div className="flex items-center mb-1">
          <div className="flex items-center justify-center w-6 h-6 bg-white rounded-md border border-red-500 mr-3">
            <FaWallet className="w-4 h-4 text-red-500" /> {/* Balance Icon */}
          </div>
          <span className="text-lg text-black font-medium">
            Balance Information
          </span>
        </div>

        <div className="bg-gray-100 border mt-2 border-gray-300 p-2 rounded-md mb-1">
          <div className="text-sm text-gray-600">BALANCE</div>
          <div className="text-sm font-bold text-green-500">
            ₹ {accountInfo.account_balance}
          </div>
        </div>

        <div className="flex justify-start space-x-2">
          <div className="bg-gray-100 border w-[50%] border-gray-300 p-1 rounded-md">
            <div className="text-sm text-gray-600">FREE CASH</div>
            <div className="text-sm text-black font-bold">₹ 0.00</div>
          </div>
          <div className="bg-gray-100 border w-[50%] border-gray-300 p-1 rounded-md">
            <div className="text-sm text-gray-600">NET EXPOSURE</div>
            <div className="text-sm font-bold text-red-500">₹ 0.00</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex p-1 space-x-2">
        <button
          onClick={() => navigate("/deposit")}
          className="flex items-center justify-center bg-green-500 text-white py-2 px-2 rounded-md flex-1"
        >
          <FaMoneyBillWave className="w-5 h-5 mr-1" /> {/* Deposit Icon */}
          <span>Deposit</span>
        </button>
        <button
          onClick={() => navigate("/withdraw")}
          className="flex items-center justify-center bg-red-700 text-white py-2 px-4 rounded-md flex-1"
        >
          <FaCoins className="w-5 h-5 mr-1" /> {/* Withdraw Icon */}
          <span>Withdraw</span>
        </button>
      </div>
    </div>
  );
};

export default AccountInfo;