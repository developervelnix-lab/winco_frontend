import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { FaClipboard } from "react-icons/fa";
import { API_URL } from "@/utils/constants"; 

const TransactionPage = () => {
  const [activeTab, setActiveTab] = useState("Deposit");
  const [filter, setFilter] = useState("All");
  const authSecretKey = sessionStorage.getItem('auth_secret_key');
  const userId = sessionStorage.getItem('account_id');
  const [depositRecords, setDepositRecords] = useState([]);
  const [withdrawRecords, setWithdrawRecords] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDepositRecords();
    fetchWithdrawRecords();
  }, []);

  const fetchWithdrawRecords = async () => {
    if (!authSecretKey) return;

    try {
      const response = await fetch(`${API_URL}?USER_ID=${userId}&PAGE_NUM=1`, {
        method: 'GET',
        headers: {
          'Route': 'route-withdraw-records',
          'AuthToken': authSecretKey
        }
      });

      const result = await response.json();
      setWithdrawRecords(result.data);
    } catch (error) {
      setToast({ message: "Failed to fetch withdraw records.", type: "error" });
    }
  };

  const fetchDepositRecords = async () => {
    if (!authSecretKey) return;

    try {
      const response = await fetch(`https://api.kolorbet.com/router/?USER_ID=${userId}&PAGE_NUM=1`, {
        method: 'GET',
        headers: {
          'Route': 'route-recharge-records',
          'AuthToken': authSecretKey
        }
      });

      const result = await response.json();
      setDepositRecords(result.data);
    } catch (error) {
      setToast({ message: "Failed to fetch deposit records.", type: "error" });
    }
  };

  const mergeTransactions = (depositRecords, withdrawRecords) => {
    return [
      ...depositRecords.map(record => ({
        id: record.r_uniq_id,
        balance: record.r_amount,
        category: "Deposit",
        date: record.r_date,
        type: record.r_mode,
        details: record.r_details,
        time: record.r_time,
        orderNumber: record.r_uniq_id,
        remark: record.r_remark,
        status: record.r_status
      })),
      ...withdrawRecords.map(record => ({
        id: record.w_uniq_id,
        balance: record.w_amount,
        category: "Withdrawal",
        date: record.w_date,
        time: record.w_time,
        orderNumber: record.w_uniq_id,
        remark: record.w_remark,
        status: record.w_status
      }))
    ];
  };

  const transactionsData = mergeTransactions(depositRecords, withdrawRecords);

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleFilterChange = (filterOption) => setFilter(filterOption.value);

  const filteredTransactions = transactionsData.filter(
    (t) => (activeTab === "All" || t.category === activeTab) && (filter === "All" || t.status === filter)
  );

  // Options for react-select
  const filterOptions = [
    { value: "All", label: "All Transactions" },
    { value: "Processing", label: "Processing" },
    { value: "success", label: "Success" },
    { value: "rejected", label: "Rejected" }
  ];

  return (
    <div className="flex flex-col max-w-4xl mx-auto bg-white text-gray-900 min-h-screen p-4 md:p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Tabs */}
      <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2">
        {["Deposit", "Withdrawal"].map((tab) => (
          <button
            key={tab}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium md:font-semibold transition whitespace-nowrap flex-shrink-0 ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter with react-select */}
      <div className="mt-4 md:mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="text-lg md:text-xl font-sans">Transactions</h2>

          <div className="w-full md:w-64">
            <Select
              options={filterOptions}
              value={filterOptions.find(option => option.value === filter)}
              onChange={handleFilterChange}
              classNamePrefix="react-select"
              isSearchable={false}
            />
          </div>
        </div>
      </div>

      {/* Transaction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} data={transaction} setToast={setToast} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No transactions found matching your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};

const TransactionCard = ({ data, setToast }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.orderNumber);
    setToast({ message: "Order number copied!", type: "success" });
  };

  const statusColors = {
    Processing: "bg-yellow-500 text-white",
    success: "bg-green-500 text-white",
    rejected: "bg-red-500 text-white"
  };

  return (
    <div className="bg-gray-100 text-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition w-full">
      <div className="flex justify-between items-center mb-2">
        <span className={`px-3 py-1 rounded text-xs md:text-sm font-semibold ${
          data.category === "Deposit"
            ? "bg-gray-300 text-green-600 border border-gray-500"
            : "bg-gray-300 text-red-700 border border-gray-500"
        }`}>
          {data.category}
        </span>
        <span className={`px-3 py-1 rounded text-xs md:text-sm font-semibold ${
          statusColors[data.status] || "bg-gray-400 text-black"
        }`}>
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </span>
      </div>

      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <span>Balance:</span>
          <span className="text-blue-500">₹{data.balance}</span>
        </div>
        <div className="flex justify-between">
          <span>Type:</span>
          <span>{data.type || "BANK"}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{data.time}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Order Number:</span>
          <div className="flex items-center space-x-2 max-w-[60%] truncate">
            <span className="truncate">{data.orderNumber}</span>
            <button
              onClick={copyToClipboard}
              className="flex-shrink-0"
              aria-label="Copy order number"
            >
              <FaClipboard className="text-gray-500 hover:text-blue-500 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const textColor = "text-white";

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-3 rounded-md shadow-lg ${bgColor} ${textColor} flex items-center justify-between w-[90%] md:w-[400px] z-50`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">&times;</button>
    </div>
  );
};

export default TransactionPage;
