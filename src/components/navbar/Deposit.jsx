/*
  Author: DevKilla
  Buy Code From: jinkteam.com
  Contact: @devkilla (Telegram)
*/

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWallet,
  faIndianRupeeSign,
  faXmark,
  faCopy,
  faCheck,
  faInfoCircle,
  faQrcode,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';

import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { Toast } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/utils/constants';

function Deposit() {
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('upi');
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [selectedOption, setSelectedOption] = useState('mayank');
  const [file, setFile] = useState(null);
  const [upi, setUpi] = useState('');
  const [upi2, setUpi2] = useState('');
  const [bank, setBank] = useState([]);
  const [utr, setUtr] = useState('');
  const [mode, setMode] = useState('');
  const navigate = useNavigate()
  const availableDepositOptions = sessionStorage.getItem('deposit_options');
  const userId = sessionStorage.getItem("account_id")
  const authSecretKey = sessionStorage.getItem("auth_secret_key")
  const [toasts, setToasts] = useState([]);
  // Payment options data
  const paymentOptions = [
    { id: 'upi1', name: 'UPI', type: 'upi', logo: faQrcode },
    { id: 'upi2', name: 'UPI', type: 'upi', logo: faQrcode },
    { id: '3', name: 'BANK', type: 'bank', logo: faCreditCard },

  ];

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };
  // UPI IDs for different options
  const upiIds = {
    mayank: "mayank@upi",
    imps: "",
    upi1: "praj",

  };

  // Quick amount options
  const quickAmounts = availableDepositOptions.split(',');

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  const generateQRCodeUrl = (upiId) => {
    if (!upiId) return null;
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiId)}&size=150x150`;
  };
  const qrCodeUrl = useMemo(() => generateQRCodeUrl(selectedOption === "upi1" ? upi : upi2), [selectedOption, upi, upi2]);
  useEffect(() => {
    setActiveTab('upi');
    setSelectedOption('upi1');
  }, []);
  useEffect(() => {
    const fetchDepositAddress = async () => {
      try {
        const response = await fetch(API_URL + "?USER_ID=" + userId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Route: "route-deposit-info",
            AuthToken: authSecretKey,
          },
        });

        const result = await response.json();
        setUpi(result.UPI.UPI_ID_1);
        setUpi2(result.UPI.UPI_ID_2);
        setBank(result.BANK_DETAILS);
      } catch (error) {
        console.error("Error fetching Deposit Address", error);
      }
    };

    fetchDepositAddress();
  }, [userId, authSecretKey]);
  useEffect(() => {
    if (activeTab === 'upi') {
      setMode('UPIPay');
    } else if (activeTab === 'bank') {
      setMode('BankPay');
    }
  }, [activeTab]);
  const handleCopyUPI = () => {
    navigator.clipboard.writeText(selectedOption === "upi1" ? upi : upi2);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDeposit = async () => {
    console.log('Amount:', amount);
    console.log('UTR:', utr);
    if (!amount || parseFloat(amount) < 100) {
      addToast('Amount must be a minimum of ₹100', 'error');
      return;
    }

    if (!utr || utr.trim() === '') {
      addToast('Please enter a valid UTR', 'error');
      return;
    }

    const url = new URL(API_URL);
    const params = new URLSearchParams({
      USER_ID: userId,
      RECHARGE_AMOUNT: amount,
      RECHARGE_MODE: mode,
      RECHARGE_DETAILS: `${utr},${mode}`,
    });

    console.log("Request URL:", url.toString() + '?' + params.toString());

    try {
      const response = await fetch(url + '?' + params.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Route': 'route-recharge-request',
          'AuthToken': authSecretKey,
        },
      });
      const result = await response.json();
      console.log("API Response:", result);

      if (result.status_code === "pending") {
        addToast(`Deposit request of ₹${amount} to ${mode} submitted successfully!`, 'success');
      } else if (result.status_code === "utr_exit") {
        addToast('UTR already exists', 'error');
      } else {
        addToast(`Deposit failed: ${result.status_code}`, 'error');
      }
    } catch (error) {
      console.error("Error processing deposit request", error);
      addToast("Error processing deposit request. Please try again later.", 'error');
    }
  };


  return (
    <div className="bg-white text-black shadow-2xl w-full max-w-md mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-white text-black p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faWallet} className="text-red-700 text-2xl" />
          <h2 className="text-black text-xl font-bold">Deposit Funds</h2>
        </div>
        {/* <button className="text-black hover:text-red-700 transition-colors">
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        </button> */}
      </div>
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onDismiss={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            color={
              toast.type === 'error' ? 'failure' :
                toast.type === 'success' ? 'success' : 'info'
            }
          >
            <div className="flex items-center">
              {toast.type === 'success' && (
                <FaCheckCircle className="text-green-500 mr-2" size={20} />
              )}
              {toast.type === 'error' && (
                <FaExclamationTriangle className="text-red-500 mr-2" size={20} />
              )}
              {toast.type === 'info' && (
                <FaInfoCircle className="text-blue-500 mr-2" size={20} />
              )}
              <div className="ml-1 text-sm font-normal">
                {toast.message}
              </div>
            </div>
          </Toast>
        ))}
      </div>
      {/* Payment Options */}
      <div className="p-4 mb-2 bg-white">
        <h3 className="text-black mb-3 font-medium">Payment Options</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {paymentOptions.map(option => (
            <button
              key={option.id}
              onClick={() => {
                setSelectedOption(option.id);
                setActiveTab(option.type);
              }}
              className={`flex flex-col items-center min-w-[100px] p-3 rounded-lg border transition-all ${selectedOption === option.id
                ? 'bg-white/10 border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-gray-300 border-gray-700 hover:bg-gray-700/30'
                }`}
            >
              {option.logo ? (
                <FontAwesomeIcon icon={option.logo} className="text-black mb-2 text-xl" />
              ) : (
                <div className="mb-2">
                  <img
                    src="/api/placeholder/40/24"
                    alt="UPI logo"
                    className="h-6"
                  />
                </div>
              )}
              <span className="text-black text-sm font-medium">{option.name}</span>
              {selectedOption === option.id && (
                <div className="absolute top-2 right-2 text-black">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-black mb-2 font-medium">Enter Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="text-black" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-black  bg-white w-full py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Quick Amounts */}
        <div className="mb-6">
          <p className="text-black mb-2 font-medium">Quick Select</p>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className="text-black border border-gray-500 bg-white rounded-lg py-2 transition-colors"
              >
                ₹ {value.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'upi' ? (
          <div>
            {(selectedOption === "upi1" || selectedOption === "upi2") && (
              <div className="bg-gray-300 border border-black rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-black font-medium">UPI ID</p>
                  <button
                    onClick={handleCopyUPI}
                    className="text-black flex items-center gap-1 text-sm"
                    aria-label="Copy UPI ID"
                  >
                    <FontAwesomeIcon icon={copiedUPI ? faCheck : faCopy} />
                    {copiedUPI ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-black font-mono text-lg">
                  {selectedOption === "upi1" ? (upi || "Coming soon") : (upi2 || "Coming soon")}
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <div className="bg-white p-3 rounded-lg">
                <img
                  src={qrCodeUrl}
                  alt="QR Code for payment"
                  className="w-32 h-32"
                  aria-label="QR code for payment"
                />

              </div>
            </div>

            <div className="bg-white border border-black rounded-lg p-4 mb-6 flex items-start gap-3">
              <FontAwesomeIcon icon={faInfoCircle} className="text-black" />
              <p className="text-black text-sm">
                After sending payment through UPI, your account will be credited within 5 minutes.
                If you face any issues, please contact customer support.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className=" bg-white border border-black text-black rounded-lg p-4 mb-6">
              <p className="text-black font-medium mb-2">Bank Details</p>
              <div className="space-y-2">
                <div>
                  <span className="text-black text-sm">Account Name:</span>
                  <p className="text-black">{bank.ACCOUNT_HOLDER}</p>
                </div>
                <div>
                  <span className="text-black text-sm">Account Number:</span>
                  <p className="text-black font-mono">{bank.ACCOUNT_NUMBER}</p>
                </div>
                <div>
                  <span className="text-black text-sm">IFSC Code:</span>
                  <p className="text-black font-mono">{bank.IFSC_CODE}</p>
                </div>
                <div>
                  <span className="text-black text-sm">Bank:</span>
                  <p className="text-black">{bank.BANK_NAME}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-black rounded-lg p-4 mb-6 flex items-start gap-3">
              <FontAwesomeIcon icon={faInfoCircle} className="text-black mt-1" />
              <p className="text-black text-sm">
                Bank transfers may take up to 24 hours to be credited to your account.
                Make sure to use your User ID as reference in the transfer.
              </p>
            </div>
          </div>
        )}
        <div className="mb-6">
          <label className="block text-black mb-2 font-medium">ENTER UTR</label>
          <input
            type="text"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder="Enter 12 digit utr number"
            className="bg-white text-black placeholder-gray-400 border border-red-800/50 w-full py-3 pl-4 pr-4 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        {/* Process Button */}
        <button onClick={handleDeposit}
          className={`w-full py-3 rounded-lg text-black font-semibold flex items-center justify-center gap-2 ${amount && parseFloat(amount) > 0 && utr
            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            : 'bg-gray-700 cursor-not-allowed opacity-70'
            } transition-all transform hover:scale-[1.02] shadow-md`}
        >
          <FontAwesomeIcon icon={faWallet} />
          Process Deposit of ₹ {amount ? parseFloat(amount).toLocaleString() : '0'}
        </button>

        {/* Warning Note */}
        <div className="mt-4 p-4 border border-red-500/30 bg-white rounded-lg">
          <p className="text-black text-sm font-medium">
            Deposit money only in the available accounts to get the fastest credits and avoid possible delays.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Deposit;