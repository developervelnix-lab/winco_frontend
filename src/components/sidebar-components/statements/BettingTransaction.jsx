/*
  Author: DevKilla
  Buy Code From: jinkteam.com
  Contact: @devkilla (Telegram)
*/


"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { API_URL } from "@/utils/constants";

const BettingTransactionPage = () => {
  const [startDate, setStartDate] = useState("05/03/2025");
  const [endDate, setEndDate] = useState("12/03/2025");
  const [activeFilter, setActiveFilter] = useState("Last 7 Days");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [currentStartMonth, setCurrentStartMonth] = useState(new Date(2025, 2, 5));
  const [currentEndMonth, setCurrentEndMonth] = useState(new Date(2025, 2, 12));
  const [searchQuery, setSearchQuery] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);

  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const [transactions, setTransactions] = useState([]);

  const authSecretKey = sessionStorage.getItem("auth_secret_key");
  const userId = sessionStorage.getItem("account_id");

  const fetchGameData = async (userId) => {
    try {
      const url = `${API_URL}?USER_ID=${userId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Route: "route-mygame-records",
          AuthToken: authSecretKey,
        },
      });

      const result = await response.json();
      console.log("Fetched Game Data:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching game data", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGameData(userId).then((data) => {
        if (data) setTransactions(data);
      });
    }
  }, [userId]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    const today = new Date();
    const startDateObj = new Date();

    if (filter === "Last 7 Days") startDateObj.setDate(today.getDate() - 7);
    else if (filter === "Last 14 Days") startDateObj.setDate(today.getDate() - 14);
    else if (filter === "Last 28 Days") startDateObj.setDate(today.getDate() - 28);

    setStartDate(formatDate(startDateObj));
    setEndDate(formatDate(today));
    setCurrentStartMonth(new Date(startDateObj));
    setCurrentEndMonth(new Date(today));
    setShowTransactions(true);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
          Betting Transactions
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["Last 7 Days", "Last 14 Days", "Last 28 Days"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 border rounded-lg transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-700 shadow-md"
                  : "bg-white text-black border-gray-400 hover:bg-red-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {transactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{transaction.r_match_name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        transaction.r_match_status === "loss" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {transaction.r_match_status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">
                    {transaction.r_date} • {transaction.r_time}
                  </p>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">₹{transaction.r_match_amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bet:</span>
                      <span className="font-semibold">₹{transaction.r_match_bet}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Profit:</span>
                      <span
                        className={`font-bold ${
                          transaction.r_match_status === "loss" ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        ₹{transaction.r_match_profit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Data */
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-48 h-48 mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">No Transactions Found</h3>
            <p className="text-gray-600 text-center text-lg max-w-md">
              No betting transactions found for the selected date range. Try adjusting your filters or search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BettingTransactionPage;
