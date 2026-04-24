"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faWallet,
  faIndianRupeeSign,
  faCheck,
  faInfoCircle,
  faCreditCard,
  faPlus,
  faChevronDown,
  faSearch,
  faTimes,
  faUniversity,
  faHistory,
  faClock,
  faTrashAlt,
  faStar,
  faShieldAlt,
  faEye,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons"
import { Toast } from "flowbite-react"
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaCoins, FaTableTennis, FaRegStar, FaStar as FaStarSolid, FaTrash } from "react-icons/fa"
import { useSite } from "../../context/SiteContext"
import { useColors } from '../../hooks/useColors';
import { FONTS, COLORS as THEME_COLORS } from '../../constants/theme';
import { API_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Withdraw = () => {
  const COLORS = useColors();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("")
  const [showAddBankPopup, setShowAddBankPopup] = useState(false)
  const [addedBankAccounts, setAddedBankAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState("")
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const [accountBalance, setAccountBalance] = useState("0")
  const { accountInfo, logout } = useSite()
  const authSecretKey = localStorage.getItem("auth_secret_key")
  const userId = localStorage.getItem("account_id")
  const [toasts, setToasts] = useState([])
  const [notification, setNotification] = useState({ isOpen: false, message: "", type: "" })
  const [availableBanks, setAvailableBanks] = useState([])
  const [bankSearch, setBankSearch] = useState("")
  const [withdrawRecords, setWithdrawRecords] = useState([])
  const [historyFilter, setHistoryFilter] = useState("All")
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [confirmSelection, setConfirmSelection] = useState({ isOpen: false, account: null })
  const [showFullAcct, setShowFullAcct] = useState(false)

  const [formData, setFormData] = useState({
    realName: "",
    accountNumber: "",
    selectedBank: "",
    ifscCode: "",
  })

  const addToast = (message, type = "info") => {
    setNotification({ isOpen: true, message, type })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const fetchBankCards = async (userId) => {
    try {
      const response = await fetch(`${API_URL}?USER_ID=${userId}&PAGE_NUM=1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Route: "route-get-bankcards",
          AuthToken: authSecretKey,
        },
      })
      const result = await response.json()
      if (result.status_code === "success") {
        setAddedBankAccounts(result.data)
      }
    } catch (error) {
      console.error("Error fetching bank cards", error)
    }
  }

  const fetchBankList = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Route: "route-get-banklist",
          AuthToken: authSecretKey,
        },
      })
      const result = await response.json()
      setAvailableBanks(result.data.banklist)
    } catch (error) {
      console.error("Error fetching bank list", error)
    }
  }

  const addBankDetails = async () => {
    if (addedBankAccounts.length >= 3) {
      addToast("Maximum 3 bank accounts allowed", "error")
      return
    }

    const { realName, accountNumber, selectedBank, ifscCode } = formData
    if (!realName || !accountNumber || !selectedBank || !ifscCode) {
      addToast("Please fill all fields", "error")
      return
    }

    // Strict IFSC Validation
    const cleanIFSC = ifscCode.trim().toUpperCase();
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    
    if (cleanIFSC.length !== 11) {
      addToast("IFSC must be exactly 11 characters", "error");
      return;
    }
    
    if (!ifscRegex.test(cleanIFSC)) {
      addToast("Invalid IFSC: First 4 letters, 5th is 0, last 6 Alphanumeric", "error");
      return;
    }

    // Account Number Validation
    const cleanAcc = accountNumber.trim();
    if (!/^\d+$/.test(cleanAcc)) {
      addToast("Account number must contain only digits", "error");
      return;
    }
    if (cleanAcc.length < 9 || cleanAcc.length > 18) {
      addToast("Account number must be 9 to 18 digits", "error");
      return;
    }

    const params = new URLSearchParams({
      USER_ID: userId,
      BENEFICIARY_NAME: realName,
      USER_BANK_NAME: selectedBank,
      USER_BANK_ACCOUNT: cleanAcc,
      USER_BANK_IFSC_CODE: cleanIFSC,
      IS_PRIMARY: "true",
      CARD_METHOD: "bank",
    })

    try {
      const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          AuthToken: authSecretKey,
          Route: "route-add-bankcard",
        },
      })
      const result = await response.json()
      if (result.status_code === "success") {
        addToast("Bank added successfully", "success")
        fetchBankCards(userId)
        setShowAddBankPopup(false)
        setFormData({ realName: "", accountNumber: "", selectedBank: "", ifscCode: "" })
      } else if (result.status_code === "authorization_error" || result.status_code === "auth_error") {
        logout()
      } else if (result.status_code === "limit_reached") {
        addToast("Maximum 3 bank accounts allowed", "error")
      } else {
        addToast(`Error: ${result.status_code}`, "error")
      }
    } catch (error) {
      addToast("Failed to add bank account", "error")
    }
  }

  const setPrimaryBankCard = async (cardId) => {
    try {
      const response = await fetch(`${API_URL}?USER_ID=${userId}&CARD_ID=${cardId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Route: "route-set-bankcard-primary",
          AuthToken: authSecretKey,
        },
      })
      const result = await response.json()
      if (result.status_code === "success") {
        fetchBankCards(userId)
        setSelectedAccount(cardId)
        addToast("Primary account updated", "success")
      } else if (result.status_code === "authorization_error" || result.status_code === "auth_error") {
        logout()
      }
    } catch (error) {
      console.error("Error setting primary bank", error)
    }
  }

  const deleteBankCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this bank account?")) return;
    try {
      const response = await fetch(`${API_URL}?USER_ID=${userId}&CARD_ID=${cardId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Route: "route-delete-bankcard",
          AuthToken: authSecretKey,
        },
      })
      let result;
      const rawResponse = await response.text();
      try {
        result = JSON.parse(rawResponse);
      } catch (e) {
        console.error("Raw response:", rawResponse);
        throw new Error(`Invalid server response: ${rawResponse.substring(0, 50)}...`);
      }

      if (result.status_code === "success") {
        addToast("Account deleted successfully", "success")
        fetchBankCards(userId)
        if (selectedAccount === cardId) setSelectedAccount("")
      } else if (result.status_code === "authorization_error" || result.status_code === "auth_error") {
        logout()
      } else {
        addToast(result.message || `Error: ${result.status_code}`, "error")
      }
    } catch (error) {
      addToast(error.message || "Failed to connect to server", "error")
    }
  }

  useEffect(() => {
    fetchBankCards(userId)
    fetchBankList()
    fetchWithdrawRecords()
  }, [authSecretKey])

  const fetchWithdrawRecords = async () => {
    if (!authSecretKey || !userId) return
    setLoadingHistory(true)
    try {
      const response = await fetch(`${API_URL}?USER_ID=${userId}&PAGE_NUM=1`, {
        method: "GET",
        headers: { Route: "route-withdraw-records", AuthToken: authSecretKey },
      })
      const result = await response.json()
      setWithdrawRecords(result.data || [])
    } catch (error) {
      console.error("Fetch error", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleWithdrawal = async () => {
    if (!selectedAccount) { addToast("Select a bank account", "error"); return; }
    if (!amount || parseFloat(amount) < 100 || parseFloat(amount) > 50000) {
      addToast("Amount: ₹100 - ₹50,000", "error"); return;
    }
    if (parseFloat(amount) > parseFloat(accountInfo?.account_balance || 0)) {
      addToast("Insufficient withdrawable balance", "error"); return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Route: "route-withdraw-request",
          AuthToken: authSecretKey,
        },
        body: JSON.stringify({ USER_ID: userId, WITHDRAW_AMOUNT: amount }),
      })
      const result = await response.json()
      if (result.status_code === "success") {
        addToast(`Withdrawal of ₹${amount} initiated!`, "success")
        setAmount("")
        fetchWithdrawRecords()
      } else if (result.status_code === "gameplay_required") {
        const req = result.required_play_balance || "a certain amount";
        addToast(`FAILED: Gameplay of ₹${req} required before withdrawal.`, "error")
      } else {
        const msg = result.message || result.status_code;
        addToast(`Failed: ${msg.replace(/_/g, ' ').toUpperCase()}`, "error")
      }
    } catch (error) {
      addToast("Error processing request", "error")
    }
  }

  const isLoggedIn = !!(accountInfo?.account_id);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <div className="text-black dark:text-white w-[95%] md:w-[90%] mx-auto overflow-hidden rounded-[1.5rem] border border-black/10 dark:border-white/10 shadow-2xl relative mb-10 transition-all duration-500 ease-out"
      style={{ backgroundColor: COLORS.bg2, color: COLORS.text }}>
      
      {/* Subtle Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/30 blur-[60px]"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand/30 blur-[60px]"></div>
      </div>

      {/* Header */}
      <div className="p-3.5 border-b border-black/5 dark:border-white/5 flex items-center justify-between relative z-10 bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand shadow-lg">
            <FontAwesomeIcon icon={faWallet} className="text-black dark:text-white text-base" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight" style={{ fontFamily: FONTS.head }}>
              Withdraw <span className="text-brand">Funds</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {notification.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[2rem] p-8 w-full max-w-xs shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 blur-[40px] rounded-full"></div>
            <div className="flex flex-col items-center text-center gap-6 relative z-10">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-inner ${
                notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                notification.type === 'error' ? 'bg-rose-500/10 text-rose-500' : 'bg-brand/10 text-brand'
              }`}>
                <FontAwesomeIcon icon={notification.type === 'success' ? faCheck : faInfoCircle} className="text-3xl" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter" style={{ fontFamily: FONTS.head }}>
                  {notification.type === 'success' ? 'Confirmed' : 'Update'}
                </h3>
                <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest leading-relaxed">
                  {notification.message}
                </p>
              </div>
              <button 
                onClick={() => setNotification({ ...notification, isOpen: false })}
                className="w-full py-4 rounded-xl bg-brand text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all hover:shadow-brand/20"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="p-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          
          {/* Left Column: Balances & Bank */}
          <div className="flex flex-col h-full space-y-4">
            <div className="grid grid-cols-1 gap-1.5">
              {/* Main Withdrawable Balance */}
              <div className="bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-xl p-2.5 flex justify-between items-center group transition-all duration-300 hover:bg-white/[0.05]">
                <div>
                  <p className="text-[7px] text-black/30 dark:text-white/30 font-black uppercase tracking-widest mb-0.5">Withdrawable Balance</p>
                  <p className="text-lg font-black text-brand" style={{ fontFamily: FONTS.head }}>₹{parseFloat(accountInfo?.account_balance || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-black/20 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand/20 transition-all border border-white/5">
                   <FontAwesomeIcon icon={faIndianRupeeSign} className="text-black/20 dark:text-white/20 group-hover:text-brand transition-all text-sm" />
                </div>
              </div>

              {/* Bonus Grid */}
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-lg p-2 flex justify-between items-center opacity-80">
                  <div>
                    <p className="text-[6px] text-black/20 dark:text-white/20 font-black uppercase tracking-widest mb-0.5">Casino Bonus</p>
                    <p className="text-sm font-black text-black/60 dark:text-white/70" style={{ fontFamily: FONTS.head }}>₹{parseFloat(accountInfo?.account_casino_bonus || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-lg p-2 flex justify-between items-center opacity-80">
                  <div>
                    <p className="text-[6px] text-black/20 dark:text-white/20 font-black uppercase tracking-widest mb-0.5">Sports Bonus</p>
                    <p className="text-sm font-black text-black/60 dark:text-white/70" style={{ fontFamily: FONTS.head }}>₹{parseFloat(accountInfo?.account_sports_bonus || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Selection */}
            <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5 flex-1 flex flex-col">
              <button 
                onClick={() => {
                  if (addedBankAccounts.length >= 3) {
                    addToast("Maximum 3 bank accounts allowed", "error")
                  } else {
                    setShowAddBankPopup(true)
                  }
                }} 
                className={`w-full py-2 rounded-lg border border-dashed text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 group ${
                   addedBankAccounts.length >= 3 
                   ? "bg-black/5 border-black/10 text-black/20 cursor-not-allowed" 
                   : "bg-brand/5 border-brand/30 text-brand hover:bg-brand hover:text-black"
                }`}
              >
                <FontAwesomeIcon icon={faPlus} className={`mr-1.5 transition-transform ${addedBankAccounts.length < 3 ? "group-hover:rotate-90" : ""}`} />
                {addedBankAccounts.length >= 3 ? "Bank Limit Reached" : "Link Bank"}
              </button>
              
              {addedBankAccounts.length > 0 ? (
                <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                   <AnimatePresence>
                     {addedBankAccounts.map((account) => (
                       <motion.div 
                         key={account.c_bank_id}
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0, x: -10 }}
                         onClick={() => {
                           if(selectedAccount !== account.c_bank_id) {
                             setConfirmSelection({ isOpen: true, account });
                           }
                         }}
                         className={`relative p-2.5 rounded-xl border transition-all cursor-pointer group ${
                           selectedAccount === account.c_bank_id 
                           ? "bg-brand/10 border-brand/50 shadow-md" 
                           : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]"
                         }`}
                       >
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                 selectedAccount === account.c_bank_id ? "bg-brand text-black shadow-sm" : "bg-white/5 text-white/10"
                               }`}>
                                 <FontAwesomeIcon icon={faUniversity} className="text-xs" />
                               </div>
                               <div>
                                 <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1">
                                   {account.c_bank_name}
                                 </p>
                                 <p className="text-[7px] font-mono opacity-30 font-bold tracking-widest uppercase">
                                   **** {account.c_bank_account.slice(-4)}
                                 </p>
                               </div>
                            </div>

                            <div className="flex items-center gap-2">
                               {/* Delete Button */}
                               <button 
                                 onClick={(e) => { e.stopPropagation(); deleteBankCard(account.c_bank_id); }}
                                 className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all"
                               >
                                 <FaTrash className="text-[9px]" />
                               </button>

                               {/* Selection Tick */}
                               {selectedAccount === account.c_bank_id && (
                                 <motion.div 
                                   initial={{ scale: 0 }}
                                   animate={{ scale: 1 }}
                                   className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-black shadow-sm"
                                 >
                                    <FontAwesomeIcon icon={faCheck} className="text-[8px]" />
                                 </motion.div>
                               )}
                            </div>
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                </div>
              ) : (
                <button onClick={() => setShowAddBankPopup(true)} className="w-full py-16 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group hover:border-brand/40 transition-all bg-white/[0.01]">
                   <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:scale-110 transition-all duration-500">
                      <FontAwesomeIcon icon={faPlus} className="text-brand group-hover:text-black transition-colors text-xl" />
                   </div>
                   <div className="text-center">
                     <p className="text-[12px] font-black uppercase tracking-[0.2em] mb-1">Add Settlement Bank</p>
                     <p className="text-[9px] font-bold opacity-20 uppercase tracking-widest">Connect an account to start withdrawing</p>
                   </div>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Amount & Confirm */}
          <div className="space-y-4 lg:pt-8">
            <div className="text-center">
              <label className="text-[8px] text-black/40 dark:text-white/40 font-black uppercase tracking-widest mb-2 block">2. Withdrawal Amount</label>
              <div className="relative max-w-[160px] mx-auto">
                <div className="absolute inset-y-0 left-3.5 flex items-center text-brand text-base"><FontAwesomeIcon icon={faIndianRupeeSign} /></div>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="0"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full py-3.5 pl-10 pr-4 rounded-2xl border border-black/10 dark:border-white/10 text-xl font-black text-center focus:outline-none focus:border-brand/40 shadow-inner bg-black/20"
                  style={{ backgroundColor: COLORS.bg3, color: COLORS.text, fontFamily: FONTS.head }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 max-w-[280px] mx-auto">
              {["500", "1000", "5000", "10000"].map((v) => (
                <button key={v} onClick={() => setAmount(v)}
                  className={`py-1.5 rounded-lg border text-[8px] font-black transition-all ${amount === v ? "bg-brand border-brand text-black dark:text-white shadow-lg" : "border-black/5 dark:border-white/5 bg-white/[0.01] text-black/40 dark:text-white/40"}`}>
                  ₹{parseInt(v)}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              <button onClick={handleWithdrawal} disabled={!amount || !selectedAccount}
                className={`w-full py-3.5 rounded-xl text-black dark:text-white font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-xl relative overflow-hidden group ${
                  amount && selectedAccount ? "opacity-100 hover:shadow-brand/20" : "opacity-20 pointer-events-none"
                }`} 
                style={{ background: COLORS.brandGradient }}>
                  <FontAwesomeIcon icon={faWallet} className="text-[12px]" />
                  <span>Confirm Payout</span>
              </button>

              <div className="flex items-start gap-2.5 p-2.5 bg-brand/5 rounded-xl border border-brand/10">
                 <FontAwesomeIcon icon={faInfoCircle} className="text-brand text-[10px] mt-0.5" />
                 <p className="text-[7px] text-black/40 dark:text-white/40 uppercase font-black leading-relaxed tracking-wider">
                    Only bonuses require gameplay (wagering) to convert to real money. Real money deposits can be withdrawn at any time.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 text-center opacity-10">
        <p className="text-[8px] uppercase font-black tracking-[1em]">Authorized Payout Node</p>
      </div>

      {/* History Section */}
      <div className="p-4 md:p-6 border-t border-black/5 dark:border-white/5 bg-black/10 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHistory} className="text-brand text-xs" />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Withdrawal History</h3>
          </div>
          <div className="flex gap-1">
            {["All", "Success", "Processing", "Rejected"].map((f) => (
              <button key={f} onClick={() => setHistoryFilter(f)}
                className={`px-2 py-1 rounded-md text-[7px] font-black uppercase transition-all ${historyFilter === f ? "bg-brand text-black" : "bg-white/5 text-black/40 dark:text-white/40 hover:bg-white/10"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {withdrawRecords
            .filter(r => historyFilter === "All" || r.w_status.toLowerCase() === historyFilter.toLowerCase())
            .slice(0, 5) // Show top 5
            .map((r, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-black dark:text-white">₹{r.w_amount}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[6px] font-black uppercase ${
                      r.w_status.toLowerCase() === 'success' ? 'bg-green-500/10 text-green-500' :
                      r.w_status.toLowerCase() === 'processing' || r.w_status.toLowerCase() === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {r.w_status}
                    </span>
                  </div>
                  <span className="text-[7px] text-black/30 dark:text-white/30 font-bold uppercase tracking-tight">{r.w_date} {r.w_time}</span>
                </div>
                <div className="text-right">
                  <span className="text-[7px] text-brand font-mono block">#{r.w_uniq_id.substring(0, 8)}</span>
                  <span className="text-[6px] text-black/20 dark:text-white/20 uppercase font-bold">{r.w_remark || 'Withdrawal'}</span>
                </div>
              </div>
            ))}
          {withdrawRecords.length === 0 && !loadingHistory && (
            <div className="py-8 text-center opacity-20">
              <FontAwesomeIcon icon={faSearch} className="mb-2 text-xs" />
              <p className="text-[8px] font-black uppercase tracking-widest">No withdrawal logs found</p>
            </div>
          )}
          {loadingHistory && (
             <div className="py-8 text-center opacity-20">
              <FontAwesomeIcon icon={faClock} className="animate-spin mb-2 text-xs" />
              <p className="text-[8px] font-black uppercase tracking-widest">Loading history...</p>
           </div>
          )}
        </div>
      </div>

      {/* Add Bank Popup */}
      <AnimatePresence>
        {showAddBankPopup && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md relative shadow-[0_30px_100px_rgba(0,0,0,1)]"
            >
              <button 
                onClick={() => setShowAddBankPopup(false)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                title="Close"
              >
                 <FontAwesomeIcon icon={faTimes} className="text-sm opacity-50" />
              </button>
              
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand/20 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faUniversity} className="text-brand text-lg" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: FONTS.head }}>
                  Link <span className="text-brand">New Account</span>
                </h3>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mt-1">Provide accurate details for fast payouts</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest ml-1">Account Holder Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-brand transition-colors">
                       <FontAwesomeIcon icon={faShieldAlt} className="text-[10px]" />
                    </div>
                    <input name="realName" value={formData.realName} onChange={handleInputChange} placeholder="AS PER PASSBOOK" 
                      className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-11 pr-5 text-xs font-bold focus:outline-none focus:border-brand/40 transition-all text-white" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest ml-1">Account Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-brand transition-colors">
                       <FontAwesomeIcon icon={faCreditCard} className="text-[10px]" />
                    </div>
                    <input name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="BANK ACCOUNT DIGITS" 
                      className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-11 pr-5 text-xs font-bold focus:outline-none focus:border-brand/40 transition-all text-white" />
                  </div>
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest ml-1">Select Bank</label>
                  <button 
                    onClick={() => {
                        setShowBankDropdown(!showBankDropdown)
                    }} 
                    className="w-full bg-black border border-white/5 rounded-2xl py-4 px-5 text-xs font-bold text-left flex justify-between items-center group hover:bg-black/60 transition-all text-white"
                  >
                    <span className={formData.selectedBank ? "text-white" : "text-white/20"}>
                      {formData.selectedBank || "CHOOSE FROM LIST"}
                    </span>
                    <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform duration-300 ${showBankDropdown ? 'rotate-180 text-brand' : 'opacity-20'}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showBankDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-[120] w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                      >
                        <div className="p-3 bg-white/[0.03] border-b border-white/5 flex items-center gap-3">
                           <FontAwesomeIcon icon={faSearch} className="text-white/20 text-[10px]" />
                           <input value={bankSearch} onChange={(e) => setBankSearch(e.target.value)} placeholder="TYPE TO FILTER..." 
                             className="bg-transparent border-none text-[10px] font-black w-full focus:ring-0 text-white placeholder:text-white/10" autoFocus />
                        </div>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar">
                          {availableBanks
                            .filter(b => b.bankName.toLowerCase().includes(bankSearch.toLowerCase()))
                            .map(b => (
                              <button key={b.bankName} onClick={() => { setFormData(p => ({ ...p, selectedBank: b.bankName })); setShowBankDropdown(false); }}
                                className="w-full text-left px-5 py-3.5 text-[10px] font-black tracking-tight text-white/50 hover:bg-brand hover:text-black transition-all">
                                {b.bankName}
                              </button>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest ml-1">IFSC Code</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-brand transition-colors">
                       <FontAwesomeIcon icon={faUniversity} className="text-[10px]" />
                    </div>
                    <input name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} placeholder="SBIN000XXXX" 
                      className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-11 pr-5 text-[10px] font-black focus:outline-none focus:border-brand/40 transition-all text-white" />
                  </div>
                </div>

                <div className="pt-4">
                  <button onClick={addBankDetails} className="w-full py-5 rounded-2xl text-black font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl active:scale-95 transition-all relative overflow-hidden"
                    style={{ background: COLORS.brandGradient }}>
                    Confirm & Link Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Select Bank Confirmation Popup */}
      <AnimatePresence>
        {confirmSelection.isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-xs shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col items-center text-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-[2rem] bg-brand/10 flex items-center justify-center text-brand shadow-inner">
                  <FontAwesomeIcon icon={faUniversity} className="text-3xl" />
                </div>
                
                <div className="space-y-4 w-full">
                  <h3 className="text-xl font-black uppercase tracking-tighter" style={{ fontFamily: FONTS.head }}>
                    Link <span className="text-brand">Account?</span>
                  </h3>
                  <div className="space-y-2.5">
                    {/* Detail Row: Bank */}
                    <div className="py-2.5 px-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                      <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Bank</span>
                      <span className="text-[9px] font-black text-brand uppercase">{confirmSelection.account.c_bank_name}</span>
                    </div>
                    {/* Detail Row: Name */}
                    <div className="py-2.5 px-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                      <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Holder</span>
                      <span className="text-[9px] font-black text-white uppercase">{confirmSelection.account.c_beneficiary}</span>
                    </div>
                    {/* Detail Row: IFSC */}
                    <div className="py-2.5 px-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                      <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">IFSC</span>
                      <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider">{confirmSelection.account.c_bank_ifsc_code}</span>
                    </div>
                    {/* Detail Row: Account Number (Middle Starred) */}
                    <div className="py-2.5 px-4 bg-brand/5 rounded-xl border border-brand/10 flex justify-between items-center relative group/acct">
                      <span className="text-[7px] font-black text-brand/40 uppercase tracking-widest">Acct No.</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-white tracking-[0.1em]">
                          {showFullAcct 
                            ? confirmSelection.account.c_bank_account 
                            : `${confirmSelection.account.c_bank_account.slice(0, 4)} **** ${confirmSelection.account.c_bank_account.slice(-4)}`
                          }
                        </span>
                        <button 
                          onClick={() => setShowFullAcct(!showFullAcct)}
                          className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-brand"
                        >
                          <FontAwesomeIcon icon={showFullAcct ? faEyeSlash : faEye} className="text-[8px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-2">
                  <button 
                    onClick={() => {
                      setSelectedAccount(confirmSelection.account.c_bank_id);
                      addToast(`${confirmSelection.account.c_bank_name} Selected`, "success");
                      setConfirmSelection({ isOpen: false, account: null });
                    }}
                    className="w-full py-4 rounded-xl bg-brand text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all hover:shadow-brand/40"
                  >
                    Confirm & Link
                  </button>
                  <button 
                    onClick={() => setConfirmSelection({ isOpen: false, account: null })}
                    className="w-full py-4 rounded-xl bg-white/5 text-white/40 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Withdraw
