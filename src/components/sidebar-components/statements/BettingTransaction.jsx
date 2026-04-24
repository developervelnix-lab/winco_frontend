"use client";

import { useState, useEffect } from "react";
import { FaHistory, FaSearch, FaCheckCircle, FaExclamationTriangle, FaChartLine } from "react-icons/fa";
import { API_URL } from "@/utils/constants";
import { useColors } from '../../../hooks/useColors';
import { FONTS } from '../../../constants/theme';
import RoundDetailsModal from './RoundDetailsModal';

const BettingTransactionPage = () => {
  const COLORS = useColors();
  const [activeFilter, setActiveFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const authSecretKey = localStorage.getItem("auth_secret_key");
  const userId = localStorage.getItem("account_id");

  const safeFloat = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  const parseDateTime = (str) => {
    if (!str) return new Date(0);
    try {
      const parts = str.split(' ');
      if (parts.length < 2) return new Date(str);
      const [datePart, timePart, ampm] = parts;
      const [day, month, year] = datePart.split('-');
      let [hours, minutes] = timePart.split(':');
      hours = parseInt(hours, 10);
      if (ampm && ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
      if (ampm && ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
      return new Date(year, month - 1, day, hours, minutes);
    } catch (e) { return new Date(str); }
  };

  const fetchGameData = async (userId, page = 1, limit = 25) => {
    setIsLoading(true);
    try {
      const url = `${API_URL}?USER_ID=${userId}&PAGE_NUM=${page}&LIMIT=${limit}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Route: "route-mygame-records",
          AuthToken: authSecretKey,
        },
      });
      const result = await response.json();
      if (result.status_code === "success") {
        setTransactions(result.data);
        setHasMore(result.data.length === limit);
      } else {
        setTransactions([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching game data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGameData(userId, currentPage, itemsPerPage);
    }
  }, [userId, currentPage, itemsPerPage]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch = (t.r_match_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.r_selection && t.r_selection.toLowerCase().includes(searchTerm.toLowerCase()));

      const status = (t.r_match_status || "").toLowerCase();
      const matchesFilter = activeFilter === "All" ||
        (activeFilter === "Wins" && (status === "profit" || status === "win")) ||
        (activeFilter === "Losses" && status === "loss") ||
        (activeFilter === "Pending" && (status === "wait" || status === "pending"));

      // Time Filtering Logic
      let matchesTime = true;
      if (timeFilter !== "All") {
        const txDate = parseDateTime(t.r_date + " " + (t.r_time || "00:00 AM"));
        const now = new Date();
        const diffDays = (now - txDate) / (1000 * 60 * 60 * 24);

        if (timeFilter === "Today") matchesTime = diffDays <= 1;
        else if (timeFilter === "7Days") matchesTime = diffDays <= 7;
        else if (timeFilter === "Month") matchesTime = diffDays <= 30;
        else if (timeFilter === "Year") matchesTime = diffDays <= 365;
      }

      return matchesSearch && matchesFilter && matchesTime;
    });

  return (
    <div className="w-full max-w-[98%] mx-auto overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl relative mb-2"
      style={{ backgroundColor: COLORS.bg2, color: COLORS.text }}>

      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/30 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/30 blur-[100px]"></div>
      </div>

      {/* Header */}
      <div className="p-2 md:p-4 border-b border-black/5 dark:border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10 bg-white/[0.02]">
        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg text-black dark:text-white text-xs md:text-base"
              style={{ background: COLORS.brandGradient }}>
              <FaChartLine />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm md:text-base font-black uppercase tracking-tight whitespace-nowrap" style={{ fontFamily: FONTS.head }}>
                Recent <span style={{ color: COLORS.brand }}>Played</span>
              </h2>
              <span className="text-[7.5px] md:text-[9px] font-bold uppercase tracking-widest text-black/30 dark:text-white/20 whitespace-nowrap">Transactional Records</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-56 group mt-1 md:mt-0">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/20 group-focus-within:text-brand transition-colors text-[10px]" />
            <input
              type="text"
              placeholder="SEARCH GAME..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 md:py-2 rounded-lg bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-black dark:text-white text-[9px] md:text-[11px] font-black uppercase tracking-widest placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-brand/40 transition-all shadow-inner"
              style={{ fontFamily: FONTS.ui }}
            />
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
          {/* Status Filter Dropdown */}
          <div className="relative group flex-1 lg:min-w-[130px]">
            <select
              value={activeFilter}
              onChange={(e) => handleFilterClick(e.target.value)}
              className="w-full appearance-none px-2 md:px-3 py-1.5 md:py-2 pr-7 md:pr-9 rounded-lg border border-black/10 dark:border-white/10 bg-black/10 dark:bg-white/[0.04] text-black dark:text-white text-[8px] md:text-[11px] font-black uppercase tracking-widest cursor-pointer focus:outline-none focus:border-brand/40 transition-all hover:bg-black/20"
              style={{ fontFamily: FONTS.ui }}
            >
              {["All", "Wins", "Losses", "Pending"].map((filter) => (
                <option key={filter} value={filter} className="bg-gray-900 text-white">
                  {filter} Status
                </option>
              ))}
            </select>
            <div className="absolute right-2 md:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-brand">
              ▼
            </div>
          </div>

          {/* Time Range Filter Dropdown */}
          <div className="relative group flex-1 lg:min-w-[130px]">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full appearance-none px-2 md:px-3 py-1.5 md:py-2 pr-7 md:pr-9 rounded-lg border border-black/10 dark:border-white/10 bg-black/10 dark:bg-white/[0.04] text-black dark:text-white text-[8px] md:text-[11px] font-black uppercase tracking-widest cursor-pointer focus:outline-none focus:border-brand/40 transition-all hover:bg-black/20"
              style={{ fontFamily: FONTS.ui }}
            >
              {[
                { val: "All", label: "Full History" },
                { val: "Today", label: "Today" },
                { val: "7Days", label: "7 Days" },
                { val: "Month", label: "Month" },
                { val: "Year", label: "Year" },
              ].map((range) => (
                <option key={range.val} value={range.val} className="bg-gray-900 text-white">
                  {range.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2 md:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-brand">
              ▼
            </div>
          </div>
        </div>
      </div>


      {/* Table Content */}
      <div className="p-2 md:p-4 relative z-10">
        {filteredTransactions.length > 0 ? (
          <>
            {/* Desktop Table - Compact */}
            <div className="hidden md:block overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-black/30 dark:text-white/25 text-[8.5px] font-black uppercase tracking-widest">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Game & Details</th>
                    <th className="px-4 py-3">Bet Amount</th>
                    <th className="px-4 py-3">Win/Loss</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTransactions.map((transaction, index) => {
                    const status = (transaction.r_match_status || "").toLowerCase();
                    const isCashout = status === "cashout" || status === "settled_cashout";
                    const isWait = status === "wait" || status === "pending";
                    const isTie = status === "tie" || status === "draw";
                    const isLoss = status === "loss";
                    const isProfit = status === "profit" || status === "win";
                    const isSports = (transaction.r_match_name || "").toLowerCase().includes("sports") || transaction.r_provider?.toLowerCase().includes("saba");

                    return (
                      <tr
                        key={index}
                        className="group hover:bg-white/[0.02] transition-all duration-300 border-b border-white/[0.01] last:border-0"
                      >
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-black text-black/40 dark:text-white/30">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10.5px] font-black text-black dark:text-white family-mono tracking-tighter opacity-70 uppercase">
                            {transaction.r_round_id || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSports ? "bg-[#3366FF]" : isProfit ? "bg-emerald-500" : isLoss ? "bg-rose-500" : "bg-orange-500"
                              }`}></div>
                            <div className="flex flex-col min-w-0">
                              <button
                                onClick={() => { setSelectedTx(transaction); setIsModalOpen(true); }}
                                className="text-[12px] font-black text-black dark:text-white uppercase tracking-tight hover:text-brand transition-colors text-left truncate"
                                style={{ fontFamily: FONTS.head }}
                              >
                                {transaction.r_match_name}
                              </button>
                              <span className="text-[9px] font-bold text-black/40 dark:text-white/20 uppercase tracking-widest truncate max-w-[150px]">
                                {isSports ? (transaction.r_match_details || "Match Details") : (transaction.r_selection ? `Choice: ${transaction.r_selection}` : transaction.r_match_details || "Bet Details")}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] font-black text-black dark:text-white opacity-80" style={{ fontFamily: FONTS.head }}>
                            ₹{safeFloat(transaction.r_match_bet ?? transaction.r_match_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className={`text-[12px] font-black ${isCashout ? "text-[#9966FF]" : isProfit ? "text-emerald-400" : isLoss ? "text-rose-400" : "text-white/40"
                              }`} style={{ fontFamily: FONTS.head }}>
                              {isLoss ? "-" : ""}₹{safeFloat(isLoss ? (transaction.r_match_bet ?? transaction.r_match_amount) : (transaction.r_match_profit ?? transaction.r_match_amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                            <span className={`text-[8.5px] font-bold ${isCashout ? "text-[#9966FF]/50" : transaction.r_match_net < 0 ? "text-rose-500/40" : "text-emerald-500/40"
                              }`}>
                              ({safeFloat(transaction.r_match_net) < 0 ? "-" : "+"}₹{Math.abs(safeFloat(transaction.r_match_net)).toFixed(2)})
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[8.5px] font-black uppercase tracking-widest ${isProfit ? "bg-emerald-500/10 border border-emerald-500/10 text-emerald-400" : 
                            isLoss ? "bg-rose-500/10 border border-rose-500/10 text-rose-400" :
                            isCashout ? "bg-[#9966FF]/10 border border-[#9966FF]/10 text-[#9966FF]" : "bg-white/5 border border-white/10 text-white/40"
                            }`}>
                            {transaction.r_match_status}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-black/60 dark:text-white/50 tabular-nums">{transaction.r_date}</span>
                            <span className="text-[9px] font-black text-black/20 dark:text-white/15 uppercase tracking-tighter">{transaction.r_time}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List - Extra Compact */}
            <div className="md:hidden space-y-2">
              {filteredTransactions.map((transaction, index) => {
                const status = (transaction.r_match_status || "").toLowerCase();
                const isCashout = status === "cashout" || status === "settled_cashout";
                const isWait = status === "wait" || status === "pending";
                const isLoss = status === "loss";
                const isProfit = status === "profit" || status === "win";

                return (
                  <div
                    key={index}
                    onClick={() => { setSelectedTx(transaction); setIsModalOpen(true); }}
                    className="p-3 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 active:scale-[0.99] transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8.5px] font-black text-black/30 dark:text-white/20 uppercase tracking-widest mb-0.5">
                          #{transaction.r_round_id?.substring(0, 10)}..
                        </span>
                        <h4 className="text-[12px] font-black text-black dark:text-white uppercase truncate max-w-[160px]" style={{ fontFamily: FONTS.head }}>
                          {transaction.r_match_name}
                        </h4>
                        <span className="text-[8.5px] font-bold text-black/30 dark:text-white/20 uppercase truncate max-w-[200px]">
                          {transaction.r_match_details || "Match Detail"}
                        </span>
                      </div>
                      <div className={`px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-tight ${isProfit ? "bg-emerald-500/10 text-emerald-400" :
                        isLoss ? "bg-rose-500/10 text-rose-400" : "bg-white/5 text-white/30"
                        }`}>
                        {transaction.r_match_status}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[7.5px] font-black text-black/20 dark:text-white/15 uppercase">Bet</span>
                        <span className="text-[10px] font-black text-black dark:text-white" style={{ fontFamily: FONTS.head }}>
                          ₹{safeFloat(transaction.r_match_bet ?? transaction.r_match_amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[7.5px] font-black text-black/20 dark:text-white/15 uppercase">Result</span>
                        <span className={`text-[10px] font-black ${isProfit ? "text-emerald-400" : isLoss ? "text-rose-400" : "text-white/40"}`} style={{ fontFamily: FONTS.head }}>
                          {isLoss ? "-" : ""}₹{safeFloat(isLoss ? (transaction.r_match_bet ?? transaction.r_match_amount) : (transaction.r_match_profit ?? transaction.r_match_amount)).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[7.5px] font-black text-black/20 dark:text-white/15 uppercase">Date</span>
                        <span className="text-[9px] font-bold text-black/60 dark:text-white/50 tabular-nums">{transaction.r_date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-20 text-center space-y-3">
            <div className="w-16 h-16 bg-white/[0.01] rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-black/5 dark:border-white/5 opacity-10">
              <FaSearch className="text-2xl" />
            </div>
            <p className="text-[9px] font-black uppercase text-black/20 dark:text-white/15 tracking-[0.4em]">No records found</p>
          </div>
        )}

        {/* Pagination Controls - Tighter */}
        <div className="mt-6 flex flex-col items-center justify-between gap-5 border-t border-white/5 pt-6">
          <div className="flex items-center gap-2.5 w-full justify-between md:justify-start">
            <span className="text-[8.5px] font-black text-black/30 dark:text-white/15 uppercase tracking-widest">Rows</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
              className="bg-black/10 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold text-black dark:text-white focus:outline-none"
            >
              {[10, 25, 50, 100].map(val => (
                <option key={val} value={val} className="bg-gray-900 text-white">{val}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[8.5px] font-black uppercase text-black/40 dark:text-white/60 disabled:opacity-10 hover:bg-black/20 transition-all"
            >
              Prev
            </button>

            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-[140px] md:max-w-none">
              {[...Array(5)].map((_, i) => {
                const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
                if (pageNum < 1) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 md:w-9 md:h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black transition-all ${currentPage === pageNum ? 'bg-brand text-white' : 'bg-black/5 dark:bg-white/5 text-black/30 dark:text-white/30 hover:bg-black/10'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={!hasMore || isLoading}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[8.5px] font-black uppercase text-black/40 dark:text-white/60 disabled:opacity-10 hover:bg-black/20 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>



      {/* Footer */}
      <div className="p-4 md:p-5 bg-brand/5 border-t border-black/5 dark:border-white/5 flex items-center gap-3 relative z-10">
        <FaHistory className="text-brand text-sm flex-shrink-0" />
        <p className="text-[8px] text-black/40 dark:text-white/40 uppercase font-black tracking-widest leading-relaxed">
          Table data is synchronized real-time. Contact support if any discrepancy is found.
        </p>
      </div>

      <div className="pb-8 text-center opacity-5 select-none pointer-events-none">
        <p className="text-[9px] font-black uppercase tracking-[2em] ml-[2em]">P&L Table Node</p>
      </div>

      <RoundDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTx}
      />
    </div>
  );
};

export default BettingTransactionPage;
