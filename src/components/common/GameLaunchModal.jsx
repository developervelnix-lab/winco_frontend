import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaPlay } from 'react-icons/fa';
import { useColors } from '../../hooks/useColors';
import { FONTS } from '../../constants/theme';
import { useNavigate } from 'react-router-dom';
import { URL as BASE_URL, API_URL } from "../../utils/constants";
import { useSite } from '../../context/SiteContext';

export default function GameLaunchModal({ show, game, error, onClose }) {
  const COLORS = useColors();
  const navigate = useNavigate();
  const { setShowLogin, refreshSiteData } = useSite();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [localError, setLocalError] = useState(error);

  const authSecretKey = localStorage.getItem("auth_secret_key");
  const userId = localStorage.getItem("account_id");

  const handleAuthError = () => {
    onClose();
    localStorage.removeItem("auth_secret_key");
    localStorage.removeItem("account_id");
    refreshSiteData();
    navigate("/");
    setShowLogin(true);
  };

  const confirmGameOpen = async () => {
    if (!game) return;
    setConfirmLoading(true);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const response = await fetch(`${API_URL}?Route=route-play-games&AuthToken=${encodeURIComponent(authSecretKey)}&USER_ID=${encodeURIComponent(userId)}`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Route: "route-play-games",
          AuthToken: authSecretKey,
        },
        body: JSON.stringify({
          USER_ID: userId,
          GAME_NAME: game["Game Name"],
          GAME_UID: game["Game UID"],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setLoadingProgress(100);
      clearInterval(progressInterval);

      if (data.status_code === "success" && data.data?.game_url) {
        setTimeout(() => {
          const encodedUrl = btoa(unescape(encodeURIComponent(data.data.game_url)));
          navigate(`/game-url/${encodeURIComponent(encodedUrl)}/${encodeURIComponent(game["Game Name"])}`);
        }, 500);
      } else if (data.status_code === "balance_error") {
        setLocalError("balance_error");
        setConfirmLoading(false);
      } else if (data.status_code === "authorization_error" || data.status_code === "auth_error") {
        setLocalError("authorization_error");
        setConfirmLoading(false);
      } else {
        setLocalError(data.status_code || "unknown_error");
        setConfirmLoading(false);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setLocalError("network_error");
      setConfirmLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 dark:bg-black/40 backdrop-blur-2xl z-[100000] transition-all duration-500 animate-fadeIn">
          <div
            className="relative p-10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] max-w-sm w-full mx-6 animate-fadeInUp border border-black/10 dark:border-white/10 text-center"
            style={{
              backgroundColor: `${COLORS.bg2}F2`,
              backgroundImage: 'radial-gradient(circle at top right, rgba(230, 160, 0, 0.05), transparent 40%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[2.5rem]"></div>

            <div
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 p-6 rounded-full shadow-2xl animate-bounce-slow"
              style={{ background: COLORS.brandGradient }}
            >
              <FaPlay className="text-black dark:text-white ml-0.5" size={28} />
            </div>

            <div className="relative z-10 mt-8 mb-8">
              {localError === "balance_error" ? (
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-brand tracking-tight uppercase" style={{ fontFamily: FONTS.head }}>
                    Insufficient Balance
                  </h3>
                  <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed px-2">
                    A minimum deposit of <span className="text-black dark:text-white font-bold">₹100</span> is required to access this premium experience.
                  </p>
                </div>
              ) : localError === "authorization_error" ? (
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-red-500 tracking-tight uppercase" style={{ fontFamily: FONTS.head }}>
                    Session Expired
                  </h3>
                  <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed px-2">
                    Your session has expired or you are not authorized to play this game. Please try logging in again.
                  </p>
                </div>
              ) : localError ? (
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-red-500 tracking-tight uppercase" style={{ fontFamily: FONTS.head }}>
                    Game Unavailable
                  </h3>
                  <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed px-2">
                    This game is currently unavailable ({localError}). Please try another one.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-black dark:text-white tracking-tight uppercase" style={{ fontFamily: FONTS.head }}>
                    READY TO WIN?
                  </h3>
                  <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed px-2">
                    You are about to enter <span className="text-black dark:text-white font-bold">{game?.["Game Name"]}</span>. Good luck!
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-8">
              {localError === "balance_error" ? (
                <button
                  onClick={() => { onClose(); }}
                  className="w-full px-6 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 group overflow-hidden relative"
                  style={{ background: COLORS.brandGradient, fontFamily: FONTS.ui }}
                >
                  <div className="absolute inset-0 bg-gray-100 dark:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span>Add Funds</span>
                </button>
              ) : localError === "authorization_error" ? (
                <button
                  onClick={handleAuthError}
                  className="w-full px-6 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 group overflow-hidden relative text-black dark:text-white"
                  style={{ background: COLORS.brandGradient, fontFamily: FONTS.ui }}
                >
                  <div className="absolute inset-0 bg-gray-100 dark:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span>Log In Again</span>
                </button>
              ) : localError ? (
                <button
                  onClick={() => { onClose(); }}
                  className="w-full px-6 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 group overflow-hidden relative text-black dark:text-white"
                  style={{ background: COLORS.brandGradient, fontFamily: FONTS.ui }}
                >
                  <div className="absolute inset-0 bg-gray-100 dark:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span>Try Other Game</span>
                </button>
              ) : (
                <button
                  onClick={confirmGameOpen}
                  className="w-full px-6 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 group overflow-hidden relative text-black dark:text-white"
                  style={{ background: COLORS.brandGradient, fontFamily: FONTS.ui }}
                >
                  <div className="absolute inset-0 bg-gray-100 dark:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span>Confirm Play</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full px-6 py-3 rounded-2xl font-bold uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:text-white hover:bg-gray-100 dark:bg-white/10 transition-all duration-300 border border-black/5 dark:border-white/5"
                style={{ fontFamily: FONTS.ui }}
              >
                {localError === "balance_error" ? "Close" : "Cancel"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {confirmLoading && createPortal(
        <div className="fixed inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-2xl z-[100000] flex flex-col items-center justify-center transition-all duration-700 animate-fadeIn">
          <div
            className="w-full max-w-md px-8 py-10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-black/10 dark:border-white/10 relative overflow-hidden text-center"
            style={{
              backgroundColor: `${COLORS.bg2}F2`,
              backgroundImage: 'radial-gradient(circle at top right, rgba(230, 160, 0, 0.05), transparent 40%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>

            <div className="relative z-10 mb-8">
              {game && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-6 group">
                    <div className="absolute -inset-4 bg-brand/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-black/10 dark:border-white/10 shadow-2xl transform transition-transform duration-700 hover:scale-105">
                      <img
                        src={game.icon || "/placeholder.svg"}
                        alt={game["Game Name"]}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                  <h3
                    className="text-2xl font-black text-black dark:text-white mb-2 tracking-wider uppercase"
                    style={{ fontFamily: FONTS.head }}
                  >
                    {game["Game Name"]}
                  </h3>
                  <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-brand shadow-[0_0_10px_rgba(230,160,0,1)]"></span>
                    Initializing Elite Experience
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-10 px-4 mb-10">
              <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-1 overflow-hidden backdrop-blur-sm border border-black/5 dark:border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out relative"
                  style={{
                    width: `${loadingProgress}%`,
                    background: COLORS.brandGradient,
                    boxShadow: `0 0 20px ${COLORS.brand}80`
                  }}
                >
                  <div className="absolute top-0 right-0 w-8 h-full bg-gray-100 dark:bg-white/40 blur-sm animate-shimmer"></div>
                </div>
              </div>
              <div className="flex justify-between mt-3 px-1">
                <span className="text-[10px] text-black/40 dark:text-white/40 font-bold uppercase tracking-widest">Connection Status</span>
                <span className="text-[10px] text-brand font-black italic">{Math.round(loadingProgress)}%</span>
              </div>
            </div>

            <div className="relative z-10 space-y-4 px-2 mb-10 text-left">
              {[
                { label: "Establishing Connection", threshold: 30 },
                { label: "Syncing Game Assets", threshold: 60 },
                { label: "Optimizing Performance", threshold: 85 }
              ].map((step, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <span className={`text-xs transition-colors duration-500 ${loadingProgress > step.threshold ? "text-black/80 dark:text-white/80" : "text-black/20 dark:text-white/20"}`} style={{ fontFamily: FONTS.ui }}>
                    {step.label}
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-700 ${loadingProgress > step.threshold
                    ? "border-brand/40 bg-brand/10 text-brand scale-110 shadow-[0_0_15px_rgba(230,160,0,0.2)]"
                    : "border-black/5 dark:border-white/5 bg-gray-100 dark:bg-white/2"
                    }`}>
                    {loadingProgress > step.threshold ? (
                      <span className="text-[10px] font-bold">✓</span>
                    ) : (
                      <div className="w-1 h-1 bg-gray-100 dark:bg-white/10 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
