"use client"

import React, { useEffect, useState } from "react"
import { FaClipboard, FaHistory, FaSearch, FaCheckCircle, FaExclamationTriangle, FaClock, FaInfoCircle } from "react-icons/fa"
import { useColors } from '../../../hooks/useColors';
import { FONTS } from '../../../constants/theme';
import { API_URL } from '../../../utils/constants';

const TransactionPage = () => {
  const COLORS = useColors();
  const [activeTab, setActiveTab] = useState("Deposit")
  const [filter, setFilter] = useState("All")
  const authSecretKey = localStorage.getItem("auth_secret_key")
  const userId = localStorage.getItem("account_id")
  const [depositRecords, setDepositRecords] = useState([])
  const [withdrawRecords, setWithdrawRecords] = useState([])
  const [toast, setToast] = useState(null)
  
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
    } catch (e) {
      return new Date(str);
    }
  };

  useEffect(() => {
    fetchDepositRecords()
    fetchWithdrawRecords()
  }, [])

  const fetchWithdrawRecords = async () => {
    if (!authSecretKey) return
    try {
      const response = await fetch(`${API_URL}?USER_ID=${userId}&PAGE_NUM=1`, {
        method: "GET",
        headers: { Route: "route-withdraw-records", AuthToken: authSecretKey },
      })
      const result = await response.json()
      setWithdrawRecords(result.data || [])
    } catch (error) {
      console.error("Fetch error", error)
    }
  }

  const fetchDepositRecords = async () => {
    if (!authSecretKey) return
    try {
      const response = await fetch(`${API_URL}?USER_ID=${userId}&PAGE_NUM=1`, {
        method: "GET",
        headers: { Route: "route-recharge-records", AuthToken: authSecretKey },
      })
      const result = await response.json()
      setDepositRecords(result.data || [])
    } catch (error) {
      console.error("Fetch error", error)
    }
  }

  const mergeTransactions = (dep, wit) => {
    return [
      ...dep.map((r) => ({
        id: r.r_uniq_id,
        balance: r.r_amount,
        category: "Deposit",
        date: r.r_date,
        type: r.r_mode,
        details: r.r_details,
        time: r.r_time,
        orderNumber: r.r_uniq_id,
        remark: r.r_remark,
        status: r.r_status,
      })),
      ...wit.map((r) => ({
        id: r.w_uniq_id,
        balance: r.w_amount,
        category: "Withdrawal",
        date: r.w_date,
        time: r.w_time,
        orderNumber: r.w_uniq_id,
        remark: r.w_remark,
        status: r.w_status,
      })),
    ]
  }

  const transactionsData = mergeTransactions(depositRecords, withdrawRecords)
  const filteredTransactions = transactionsData.filter(
    (t) => (t.category === activeTab) && (filter === "All" || t.status.toLowerCase() === filter.toLowerCase())
  ).sort((a, b) => parseDateTime(b.date) - parseDateTime(a.date))

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToast({ message: "ID Copied", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="text-black dark:text-white w-full max-w-5xl mx-auto overflow-hidden rounded-2xl md:rounded-3xl border border-black/10 dark:border-white/10 shadow-3xl relative mb-2"
      style={{ backgroundColor: COLORS.bg2, color: COLORS.text }}>

      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand/30 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand/30 blur-[100px]"></div>
      </div>

      {/* Header */}
      <div className="p-3 md:p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between relative z-10 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center bg-brand shadow-lg text-black dark:text-white text-base">
            <FaHistory size={16} />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-black uppercase tracking-tight" style={{ fontFamily: FONTS.head }}>
              Account <span className="text-brand">History</span>
            </h2>
            <p className="text-[8px] font-bold uppercase tracking-widest text-black/20 dark:text-white/20">Statement Logs</p>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center px-4 py-2.5 rounded-xl border shadow-2xl backdrop-blur-xl ${toast.type === "success" ? "bg-black/80 border-green-500/30 text-white" : "bg-black/80 border-red-500/30 text-white"}`}>
            {toast.type === "success" ? <FaCheckCircle className="text-green-500 mr-2 text-sm" /> : <FaExclamationTriangle className="text-red-500 mr-2 text-sm" />}
            <span className="text-[10px] font-black uppercase tracking-wide">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="p-3 md:p-4 space-y-3 md:space-y-4 relative z-10">
        
        {/* Tabs */}
        <div className="flex bg-black/5 dark:bg-black p-1 rounded-xl border border-black/5 dark:border-white/5 w-full max-w-xs mx-auto">
          {["Deposit", "Withdrawal"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? "bg-brand text-black shadow-md" : "text-black/30 dark:text-white/30 hover:text-black/50 dark:text-white/50"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-1">
          {["All", "Success", "Processing", "Rejected"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg border text-[7.5px] font-black uppercase tracking-widest transition-all ${filter === f ? "border-brand/40 bg-brand/10 text-brand" : "border-black/5 dark:border-white/5 bg-white/[0.03] text-black/20 dark:text-white/20"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Transaction Content */}
        <div className="mt-2">
          {filteredTransactions.length > 0 ? (
            <>
              {/* Desktop Table - Compact */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/10 dark:bg-white/5">
                      <th className="p-3 text-[8.5px] font-black uppercase tracking-widest opacity-40">Identification</th>
                      <th className="p-3 text-[8.5px] font-black uppercase tracking-widest opacity-40">Method</th>
                      <th className="p-3 text-[8.5px] font-black uppercase tracking-widest opacity-40">Details</th>
                      <th className="p-3 text-[8.5px] font-black uppercase tracking-widest opacity-40">Amount</th>
                      <th className="p-3 text-[8.5px] font-black uppercase tracking-widest opacity-40 text-center">Status</th>
                      <th className="p-3 text-[8.5px] font-black uppercase tracking-widest opacity-40 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-black/5 dark:border-white/5 hover:bg-brand/[0.02] transition-colors group">
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9.5px] font-mono font-bold text-black/40 dark:text-white/30 tracking-wider">
                              {tx.orderNumber.substring(0, 12)}...
                            </span>
                            <button onClick={() => copyToClipboard(tx.orderNumber)}
                              className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-black/20 dark:text-white/20 hover:text-brand hover:bg-brand/10 transition-all opacity-0 group-hover:opacity-100 border border-black/5 dark:border-white/5">
                              <FaClipboard size={8} />
                            </button>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${tx.category === 'Deposit' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
                            <span className="text-[10px] font-black uppercase tracking-tight text-black dark:text-white/80">
                              {tx.category === 'Deposit' ? tx.type : 'Withdraw'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold text-black/30 dark:text-white/30 italic truncate max-w-[120px] block">
                            {tx.category === 'Deposit' ? (tx.details || 'Recharge') : (tx.remark || 'Withdrawal')}
                          </span>
                          {tx.category === 'Deposit' && tx.remark && (
                            <span className="text-[8px] font-black uppercase text-brand mt-1 flex items-center gap-1 opacity-70">
                              <FaInfoCircle size={8} /> {tx.remark}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-black text-black dark:text-white" style={{ fontFamily: FONTS.head }}>₹{tx.balance}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center">
                            <div className={`px-2 py-0.5 rounded text-[7.5px] font-black uppercase tracking-tight flex items-center gap-1 border ${tx.status.toLowerCase() === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' :
                              tx.status.toLowerCase() === 'processing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' :
                                'bg-rose-500/10 text-rose-400 border-rose-500/10'
                              }`}>
                              {tx.status.toLowerCase() === 'processing' ? <FaClock className="animate-spin text-[8px]" /> :
                                tx.status.toLowerCase() === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                              {tx.status}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="text-[9px] font-bold text-black/30 dark:text-white/20 uppercase tracking-tighter">
                            {tx.date}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List - Extra Compact */}
              <div className="md:hidden space-y-2">
                {filteredTransactions.map((tx) => (
                  <div key={tx.id} className="p-3 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest mb-0.5">#{tx.orderNumber.substring(0, 10)}</span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${tx.category === 'Deposit' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                          <span className="text-[11px] font-black uppercase tracking-tight text-black dark:text-white">{tx.category === 'Deposit' ? tx.type : 'Withdrawal'}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase ${tx.status.toLowerCase() === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                        tx.status.toLowerCase() === 'processing' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                        {tx.status}
                      </div>
                    </div>
                    <div className="flex justify-between items-end pt-2 border-t border-black/5 dark:border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[7.5px] font-black text-black/20 dark:text-white/10 uppercase mb-0.5">Amount</span>
                        <span className="text-[11px] font-black text-black dark:text-white" style={{ fontFamily: FONTS.head }}>₹{tx.balance}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[7.5px] font-black text-black/20 dark:text-white/10 uppercase mb-0.5">{tx.date}</span>
                        <span className="text-[8.5px] font-bold text-black/30 dark:text-white/20">{tx.time}</span>
                      </div>
                    </div>
                    {tx.remark && (
                      <div className="mt-2 p-2 rounded-lg bg-brand/5 border border-brand/10">
                        <p className="text-[8px] font-black text-brand uppercase flex items-center gap-1.5 leading-tight">
                          <FaInfoCircle size={8} /> {tx.remark}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 bg-white/[0.01] rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-black/5 dark:border-white/5 opacity-10">
                <FaSearch className="text-2xl" />
              </div>
              <p className="text-[9px] font-black uppercase text-black/10 dark:text-white/10 tracking-[0.6em]">No logs</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 md:p-4 bg-brand/5 border-t border-black/5 dark:border-white/5 flex items-center gap-2.5 relative z-10">
        <FaInfoCircle className="text-brand text-xs flex-shrink-0" />
        <p className="text-[8px] text-black/30 dark:text-white/30 uppercase font-black tracking-wider leading-relaxed">
          Records are updated in real-time.
        </p>
      </div>

      <div className="pb-4 text-center opacity-5 select-none pointer-events-none">
        <p className="text-[8px] font-black uppercase tracking-[1.5em] ml-[1.5em]">Log Node 01</p>
      </div>
    </div>
  )
}

export default TransactionPage
