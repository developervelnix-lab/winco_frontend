/*
  Author: DevKilla
  Buy Code From: jinkteam.com
  Contact: @devkilla (Telegram)
*/


"use client"

import { useState, useEffect } from "react"
import { FaArrowLeft, FaWallet, FaExpand, FaCompress, FaTrophy, FaTimesCircle, FaPlus } from "react-icons/fa"
import { useParams, useNavigate } from "react-router-dom"
import { API_URL } from "@/utils/constants"
import { useColors } from '../hooks/useColors'
import { FONTS } from '../constants/theme'
import { useSite } from "../context/SiteContext"

const GameplayComponent = () => {
  const { gameUrl: encodedUrl, gameName } = useParams()
  const navigate = useNavigate()
  const COLORS = useColors()
  const { accountInfo, refreshSiteData } = useSite()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [mouseIdle, setMouseIdle] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  
  // Real-time Win/Loss Notifications
  const [lastProcessedId, setLastProcessedId] = useState(null)
  const [showResultPop, setShowResultPop] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const authSecretKey = localStorage.getItem("auth_secret_key");
  const userId = localStorage.getItem("account_id");

  const [knownStatuses, setKnownStatuses] = useState({});

  // Poller for new results
  useEffect(() => {
    if (!userId || !authSecretKey) return;

    const pollResults = async () => {
      try {
        const response = await fetch(`${API_URL}?USER_ID=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Route: "route-mygame-records",
            AuthToken: authSecretKey,
          },
        });
        const result = await response.json();
        if (result.status_code === "success" && result.data && result.data.length > 0) {
          
          setKnownStatuses(prev => {
            const isInitialLoad = Object.keys(prev).length === 0;
            const nextStatuses = { ...prev };
            let latestPopup = null;

            // Iterate backwards (oldest first) so the newest notification takes final precedence
            for (let i = result.data.length - 1; i >= 0; i--) {
              const record = result.data[i];
              const oldStatus = prev[record.id];
              const newStatus = record.r_match_status;

              // Only trigger popups for updates happening AFTER the initial status fetch
              if (!isInitialLoad) {
                // Check if it's a completely new settled record OR a transition from wait -> settled
                if ((!oldStatus && (newStatus === "profit" || newStatus === "loss")) || 
                    (oldStatus === "wait" && newStatus !== "wait")) {
                  latestPopup = record;
                }
              }

              // Always update memory
              nextStatuses[record.id] = newStatus;
            }

            if (latestPopup) {
              refreshSiteData();
              setLastResult(latestPopup);
              setShowResultPop(false); // Reset animation
              setTimeout(() => setShowResultPop(true), 50);
              // Auto hide after 4 seconds
              setTimeout(() => setShowResultPop(false), 4000);
            }

            return nextStatuses;
          });
        }
      } catch (err) {
        console.error("Result poller error:", err);
      }
    };

    const interval = setInterval(pollResults, 5000);
    pollResults(); // Initial check
    return () => clearInterval(interval);
  }, [userId, authSecretKey, refreshSiteData]);

  // Decode URL from Base64 if it's encoded, otherwise use as is
  const getDecodedUrl = (str) => {
    try {
      if (!str) return "";
      const decodedStr = decodeURIComponent(str);
      if (decodedStr.includes("://")) return decodedStr;
      return atob(decodedStr);
    } catch (e) {
      return decodeURIComponent(str);
    }
  };

  const gameUrl = getDecodedUrl(encodedUrl);

  const handleBack = () => setShowExitConfirm(true)
  const confirmExit = () => navigate("/")
  const cancelExit = () => setShowExitConfirm(false)
  
  const isWin = lastResult?.r_match_status === "profit";

  // Handle deposit button click
  const handleDeposit = () => {
    navigate("/deposit")
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
            setIsFullscreen(false)
          })
          .catch((err) => {
            console.error(`Error attempting to exit fullscreen: ${err.message}`)
          })
      }
    }
  }

  // Auto-hide header when mouse is idle + Aggressive Hide EasySocial Widget
  useEffect(() => {
    let timeout
    
    // Inject global CSS to hide EasySocial widget aggressively
    const style = document.createElement('style');
    style.id = 'hide-easysocial-style';
    style.innerHTML = `
      .es-chat-widget, 
      #es-chat-widget,
      [class*="easysocial"], 
      [id*="easysocial"],
      .es-widget-bubble,
      #es-widget-bubble { 
        display: none !important; 
        visibility: hidden !important; 
        opacity: 0 !important; 
        pointer-events: none !important; 
      }
    `;
    document.head.appendChild(style);

    // Refresh balance every 10 seconds while playing (in addition to result-based refreshes)
    const balanceInterval = setInterval(() => {
      refreshSiteData();
    }, 10000);

    const resetTimer = () => {
      clearTimeout(timeout)
      setMouseIdle(false)
      setIsHeaderVisible(true)

      timeout = setTimeout(() => {
        setMouseIdle(true)
        setIsHeaderVisible(false)
      }, 3000) // Hide after 3 seconds of inactivity
    }

    window.addEventListener("mousemove", resetTimer)
    resetTimer()

    return () => {
      window.removeEventListener("mousemove", resetTimer)
      clearTimeout(timeout)
      clearInterval(balanceInterval);
      // Remove the style tag to restore widget on other pages
      const addedStyle = document.getElementById('hide-easysocial-style');
      if (addedStyle) addedStyle.remove();
    }
  }, [refreshSiteData])

  return (
    <div className="fixed inset-0 flex flex-col bg-black overflow-hidden">
      {/* Header - Premium Glassmorphism Design */}
      <div
        className={`fixed top-0 left-0 right-0 h-[60px] md:h-[70px] flex justify-between items-center px-3 md:px-6 z-[100] transition-all duration-500 ease-in-out border-b border-white/5 backdrop-blur-2xl ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ 
          backgroundColor: 'var(--bg2)',
          boxShadow: isHeaderVisible ? "0 4px 30px rgba(0, 0, 0, 0.5)" : "none"
        }}
      >
        {/* Left Side: Back & Branding */}
        <div className="flex items-center gap-2 md:gap-5 flex-1 min-w-0">
          <button
            onClick={handleBack}
            className="group relative flex items-center justify-center hover:opacity-80 w-9 h-9 md:w-11 md:h-11 rounded-xl border border-[var(--bg4)] transition-all duration-300 active:scale-95 flex-shrink-0"
            title="Back to games"
            style={{ backgroundColor: 'var(--bg3)' }}
          >
            <FaArrowLeft className="transition-colors text-sm md:text-base" style={{ color: 'var(--text)' }} />
          </button>
          
          <div className="flex flex-col min-w-0">
            <h1 
              className="text-sm md:text-lg font-black uppercase tracking-wider truncate"
              style={{ fontFamily: FONTS.head, color: 'var(--text)' }}
            >
              {decodeURIComponent(gameName)}
            </h1>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
            </div>
          </div>
        </div>

        {/* Right Side: Balance and Controls */}
        <div className="flex items-center gap-2 md:gap-4 ml-2">
          {/* Balance Display (Optimized for all screens) */}
          <div className="flex items-center border border-[var(--bg4)] rounded-2xl px-2 py-1 md:px-4 md:py-2 gap-2 md:gap-3 shadow-inner" style={{ backgroundColor: 'var(--bg3)' }}>
            <div className="flex flex-col items-end">
              <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest leading-none" style={{ color: 'var(--muted)' }}>Balance</span>
              <span className="text-[10px] md:text-sm font-black tracking-tighter" style={{ fontFamily: FONTS.ui, color: 'var(--text)' }}>
                ₹{parseFloat(accountInfo?.account_balance || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="hidden xs:flex w-6 h-6 md:w-8 md:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 items-center justify-center">
              <FaWallet className="text-emerald-500 text-[10px] md:text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={handleDeposit}
              className="relative group flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-wider transition-all duration-500 shadow-lg active:scale-95 overflow-hidden"
              style={{ background: 'var(--brand-gradient)', color: 'white' }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <FaPlus className="text-[10px] md:text-xs" />
              <span className="whitespace-nowrap">Deposit</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center hover:opacity-80 w-9 h-9 md:w-11 md:h-11 rounded-xl border border-[var(--bg4)] transition-all duration-300 active:scale-95"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              style={{ backgroundColor: 'var(--bg3)', color: 'var(--text)' }}
            >
              {isFullscreen ? <FaCompress size={14} className="md:size-4" /> : <FaExpand size={14} className="md:size-4" />}
            </button>
          </div>
        </div>
      </div>

    <div className="flex-1 w-full relative pt-[60px] md:pt-[70px]">
        {/* Show a hint to move mouse when header is hidden */}
        {mouseIdle && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md text-white text-[10px] md:text-xs py-1.5 px-4 rounded-full z-10 animate-pulse border border-white/10 font-black uppercase tracking-widest">
            Move mouse to show controls
          </div>
        )}

        <iframe
          src={gameUrl}
          title={decodeURIComponent(gameName)}
          className="w-full h-full border-0"
          allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Result Notification Popup (Win/Loss) */}
      <div 
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-[150] transition-all duration-700 pointer-events-none ${
          showResultPop ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        <div className={`
          flex items-center gap-4 px-6 py-4 rounded-3xl border shadow-2xl backdrop-blur-md
          ${isWin 
            ? "bg-emerald-500/90 border-emerald-400/50 text-white" 
            : "bg-rose-500/90 border-rose-400/50 text-white"}
        `}>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
            {isWin ? <FaTrophy className="text-2xl animate-bounce" /> : <FaTimesCircle className="text-2xl" />}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-0.5">
              {lastResult?.r_match_name} Result
            </p>
            <h3 className="text-xl font-black uppercase tracking-tight leading-none mb-1">
              {isWin ? "You Won!" : "You Lost"}
            </h3>
            <p className="text-sm font-bold">
              {isWin ? "+" : "-"}₹{parseFloat(isWin ? lastResult?.r_match_profit : lastResult?.r_match_amount || 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
    {showExitConfirm && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
          onClick={cancelExit}
        />
        
        {/* Modal Content */}
        <div 
          className="relative border border-[var(--bg4)] rounded-[2.5rem] p-10 max-w-sm w-full shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 text-center overflow-hidden"
          style={{ 
            backgroundColor: 'var(--bg2)',
            backgroundImage: 'radial-gradient(circle at top right, rgba(230, 160, 0, 0.05), transparent 40%)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[2.5rem]"></div>
          
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group"
            style={{ background: 'var(--brand-gradient)' }}
          >
            <FaArrowLeft className="text-white text-xl group-hover:-translate-x-1 transition-transform" />
          </div>
          
          <h2 
            className="text-2xl font-black mb-3 uppercase tracking-tighter"
            style={{ fontFamily: FONTS.head, color: 'var(--text)' }}
          >
            End Session?
          </h2>
          <p className="mb-10 px-2 leading-relaxed font-medium text-sm" style={{ color: 'var(--muted)' }}>
            Are you sure you want to exit <span className="font-bold" style={{ color: 'var(--text)' }}>{decodeURIComponent(gameName)}</span>? Your balance is safe.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={confirmExit}
              className="py-4 px-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all duration-500 shadow-xl active:scale-95 group relative overflow-hidden"
              style={{ background: 'var(--brand-gradient)', color: '#FFFFFF' }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span>Exit Now</span>
            </button>
            <button
              onClick={cancelExit}
              className="py-4 px-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 border border-[var(--bg4)] hover:opacity-80"
              style={{ 
                backgroundColor: 'var(--bg3)', 
                color: 'var(--text)'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)
}

export default GameplayComponent
