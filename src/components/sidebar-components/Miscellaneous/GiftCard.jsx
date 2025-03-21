import React, { useState } from 'react';
import { FaGift, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Toast } from 'flowbite-react';

const GiftCardRedemption = () => {
  const [redeemCode, setRedeemCode] = useState('');
  const [toasts, setToasts] = useState([]);
  const authSecretKey = sessionStorage.getItem('auth_secret_key');
  const accountId = sessionStorage.getItem('account_id');

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const fetchClaimGiftCard = async () => {
    if (!authSecretKey) {
      addToast('Authentication required!', 'error');
      return;
    }

    try {
      const response = await fetch('https://api.ranamatch.com/router/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'AuthToken': authSecretKey,
          'Route': 'route-claim-giftcard'
        },
        body: JSON.stringify({
          "USER_ID": accountId,
          "GIFTCARD_ID": redeemCode
        })
      });

      const result = await response.json();
      console.log("Gift Card Claim Response:", result);

      if (result.status_code) {
        if(result.status_code === 200) {
          addToast("Successfully claimed gift card! Your reward has been added to your account.", 'success');
        } else {
          addToast(`Claim rejected: ${result.message || 'Invalid gift card code'}`, 'error');
        }
      } else {
        addToast('Failed to claim gift card!', 'error');
      }
    } catch (error) {
      console.error("Error claiming gift card", error);
      addToast('Error processing request. Please try again later.', 'error');
    }
  }

  const handleSubmitCode = () => {
    if (!redeemCode) {
      addToast('Please enter a redeem code', 'error');
      return;
    }

    fetchClaimGiftCard();
    setRedeemCode('');
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 flex flex-col items-center justify-center p-4 relative">
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
              <div className="ml-1 text-sm font-normal">
                {toast.message}
              </div>
            </div>
          </Toast>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center mb-2 text-gray-800">
        <FaGift size={32} className="mr-3" />
        <h1 className="text-3xl font-bold">Redeem Your Gift Card</h1>
      </div>

      {/* Card Display */}
      <div className="w-full max-w-md bg-white rounded-t-xl shadow-lg p-4 mb-0 flex flex-col items-center">
        <div className="relative w-48 h-28 flex items-center justify-center">
          <FaGift size={60} className="text-yellow-500" />
        </div>
        <h2 className="text-xl font-sans text-gray-700 mt-2">Unlock your rewards!</h2>
        <p className="text-gray-500 text-center mt-1">Enter your gift card code to claim exclusive benefits.</p>
      </div>

      {/* Redemption Form */}
      <div className="w-full max-w-md bg-white rounded-b-xl shadow-lg p-8">
        <label className="block text-gray-700 font-semibold mb-2">Enter Redeem Code</label>
        <input
          type="text"
          value={redeemCode}
          onChange={(e) => setRedeemCode(e.target.value)}
          placeholder="Enter your redeem code"
          className="w-full p-4 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
        />

        <button 
          className="w-full p-4 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={handleSubmitCode}
        >
          Claim Now
        </button>
      </div>
    </div>
  );
};

export default GiftCardRedemption;