import React, { useState, useEffect } from 'react';
import { Toast } from 'flowbite-react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [showAddBankPopup, setShowAddBankPopup] = useState(false);
  const [addedBankAccounts, setAddedBankAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const authSecretKey = sessionStorage.getItem('auth_secret_key');
  const userId = sessionStorage.getItem('account_id');
  const availableBalance = sessionStorage.getItem('avl_balance');
  const [toasts, setToasts] = useState([]);

  const [formData, setFormData] = useState({
    realName: '',
    accountNumber: '',
    selectedBank: '',
    ifscCode: ''
  });

  const availableBanks = [
    { name: 'Indian Overseas Bank', icon: '/path-to-indian-overseas-icon.png' },
    { name: 'State Bank of India (SBI)', icon: '/path-to-sbi-icon.png' },
    { name: 'HDFC Bank', icon: '/path-to-hdfc-icon.png' },
    { name: 'ICICI Bank', icon: '/path-to-icici-icon.png' },
    { name: 'Axis Bank', icon: '/path-to-axis-icon.png' },
    { name: 'Kotak Mahindra Bank', icon: '/path-to-kotak-icon.png' }
  ];

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchBankCards = async (userId) => {
    try {
        const url = `https://api.mgfclub.com/router/?USER_ID=${userId}&PAGE_NUM=1`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Route': 'route-get-bankcards'
            }
        });

        const result = await response.json();

        if (result.status_code === "success") {
          setAddedBankAccounts(result.data);
          const primaryBank = result.data.find(bank => bank.c_is_primary === "true");
          if (primaryBank) {
            setSelectedAccount(primaryBank.c_bank_id);
          }
          addToast('Bank accounts loaded successfully', 'success');
        } else {
            addToast(`Failed to load bank accounts: ${result.status_code}`, 'error');
        }
    } catch (error) {
        console.error("Error fetching bank cards", error);
        addToast("Error loading bank accounts. Please try again.", 'error');
    }
  };

  const addBankDetails = async (userId, userAccountName, userBankName, userBankAccountNumber, userIfscCode) => {
    if (!authSecretKey) {
        addToast("Authentication required!", 'error');
        return;
    }
    const url = new URL("https://api.mgfclub.com/router/");
    url.searchParams.append("USER_ID", userId);
    url.searchParams.append("BENEFICIARY_NAME", userAccountName);
    url.searchParams.append("USER_BANK_NAME", userBankName);
    url.searchParams.append("USER_BANK_ACCOUNT", userBankAccountNumber);
    url.searchParams.append("USER_BANK_IFSC_CODE", userIfscCode);
    url.searchParams.append("IS_PRIMARY", "true");
    url.searchParams.append("CARD_METHOD", "bank");

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'AuthToken': authSecretKey,
                'Route': 'route-add-bankcard'
            }
        });

        const result = await response.json();

        if(result.status_code === "success") {
            addToast('Bank account added successfully', 'success');
            fetchBankCards(userId);
        } else {
            addToast(`Failed to add bank account: ${result.status_code}`, 'error');
        }
    } catch (error) {
        console.error("Error fetching bank details", error);
        addToast("Error processing request. Please try again later.", 'error');
    }
  };

  const setPrimaryBankCard = async (cardId) => {
    try {
        const url = `https://api.mgfclub.com/router/?USER_ID=${userId}&CARD_ID=${cardId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Route': 'route-set-bankcard-primary'
            }
        });

        const result = await response.json();

        if (result.status_code === "success") {
            addToast("Primary bank account set successfully!", 'success');
            fetchBankCards(userId);
            setSelectedAccount(cardId);
        } else {
            addToast(`Failed to set primary bank account: ${result.status_code}`, 'error');
        }
    } catch (error) {
        console.error("Error setting primary bank card", error);
        addToast("Error processing request. Please try again later.", 'error');
    }
  };

  useEffect(() => { 
    fetchBankCards(userId);
    setAccountBalance(availableBalance);
  }, [authSecretKey]);

  const handleAddBank = () => {
    const { realName, accountNumber, selectedBank, ifscCode } = formData;
    if (!realName || !accountNumber || !selectedBank || !ifscCode) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    addBankDetails(userId, realName, selectedBank, accountNumber, ifscCode);
    setShowAddBankPopup(false);
    setFormData({ realName: '', accountNumber: '', selectedBank: '', ifscCode: '' });
  };

  const handleWithdrawal = async() => {
    if (!selectedAccount) {
      addToast('Please select a bank account', 'error');
      return;
    }
    if (!amount || parseFloat(amount) < 100 || parseFloat(amount) > 50000) {
      addToast('Amount must be between ₹100 and ₹50,000', 'error');
      return;
    }

    try {
      const response = await fetch('https://api.ranamatch.com/router/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Route': 'route-withdraw-request',
          'AuthToken': authSecretKey
        },
        body: JSON.stringify({
          "USER_ID": userId,
          "WITHDRAW_AMOUNT": amount,
        })
      });
      const result = await response.json();
      if(result.status_code === "success"){
        const selectedBank = addedBankAccounts.find(acc => acc.c_bank_id === selectedAccount);
        addToast(`Withdrawal request of ₹${amount} to ${selectedBank.c_bank_name} (****${selectedBank.c_bank_account.slice(-4)}) submitted successfully!`, 'success');
        setAmount('');
      } else {
        addToast(`Withdrawal failed: ${result.message || result.status_code}`, 'error');
      }
    } catch(error) {
      console.error("Error processing withdrawal request", error);
      addToast("Error processing withdrawal request. Please try again later.", 'error');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl max-w-md mx-auto shadow-lg relative">
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

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Fund Withdrawal</h2>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <label className="block text-sm text-gray-700 mb-2">Available Balance</label>
          <p className="text-2xl font-semibold text-yellow-400">₹{accountBalance}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Withdrawal Account</label>
          <div className="flex flex-col gap-3">
            {addedBankAccounts.length > 0 ? (
              <>
                <select
                  value={selectedAccount}
                  onChange={(e) => setPrimaryBankCard(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-black focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  {addedBankAccounts.map(account => (
                    <option key={account.c_bank_id} value={account.c_bank_id} className="bg-white">
                      {account.c_is_primary === "true" && "⭐ Primary - "}
                      {account.c_bank_name} (****{account.c_bank_account.slice(-4)})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAddBankPopup(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors"
                >
                  + Add New Account
                </button>
              </>
            ) : (
              <div className="text-center py-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600 mb-3">No accounts added</p>
                <button
                  onClick={() => setShowAddBankPopup(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add Bank Account
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Amount (₹)</label>
          <input
            type="number"
            placeholder="Enter amount (100 - 50,000)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4">
          <button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors"
            onClick={handleWithdrawal}
          >
            Confirm Withdrawal
          </button>
        </div>
      </div>

      {showAddBankPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-xl p-6 w-96 relative">
            <h3 className="text-xl font-bold text-black mb-6">Add Bank Account</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Account Holder Name</label>
                <input
                  name="realName"
                  value={formData.realName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 rounded-lg p-3 text-black focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Account Number</label>
                <input
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 rounded-lg p-3 text-black focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Select Bank</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowBankDropdown(!showBankDropdown)}
                    className="w-full bg-gray-100 rounded-lg p-3 text-black text-left focus:ring-2 focus:ring-blue-500"
                  >
                    {formData.selectedBank || 'Select Bank'}
                  </button>
                  {showBankDropdown && (
                    <div className="absolute z-10 w-full mt-10 bg-white rounded-md shadow-lg overflow-y-auto max-h-40">
                      {availableBanks.map(bank => (
                        <button
                          key={bank.name}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, selectedBank: bank.name }));
                            setShowBankDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {bank.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">IFSC Code</label>
                <input
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 rounded-lg p-3 text-black focus:ring-2 focus:ring-blue-500"
                  placeholder="SBIN0000123"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddBank}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
              >
                Save Account
              </button>
              <button
                onClick={() => setShowAddBankPopup(false)}
                className="px-4 py-3 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;