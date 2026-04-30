import React, { useEffect } from 'react';
import { useSite } from '../../context/SiteContext';
import { useColors } from '../../hooks/useColors';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes } from 'react-icons/fa';

const BroadcastModal = () => {
    const { notice, setNotice } = useSite();
    const COLORS = useColors();

    useEffect(() => {
        if (notice) {
            const timer = setTimeout(() => {
                dismissToast();
            }, 10000); // 10 seconds
            return () => clearTimeout(timer);
        }
    }, [notice]);

    const dismissToast = async () => {
        if (!notice) return;
        
        const bId = notice.id;
        if (!bId) {
            setNotice(null);
            return;
        }
        
        // 1. Mark Locally
        const acknowledgedNotices = JSON.parse(localStorage.getItem("acknowledged_notices") || "[]");
        if (!acknowledgedNotices.includes(bId)) {
            acknowledgedNotices.push(bId);
            localStorage.setItem("acknowledged_notices", JSON.stringify(acknowledgedNotices));
        }

        // 2. Mark on Server
        try {
            const userId = localStorage.getItem("account_id");
            const authSecretKey = localStorage.getItem("auth_secret_key");
            const formData = new FormData();
            formData.append("broadcast_id", bId);
            formData.append("user_id", userId);

            const { API_URL } = await import('../../utils/constants');
            
            fetch(API_URL, {
                method: "POST",
                body: formData,
                headers: {
                    "AuthToken": authSecretKey,
                    "Route": "route-mark-broadcast-seen"
                }
            });
        } catch (e) {
            console.error("Failed to mark broadcast as seen on server:", e);
        }

        setNotice(null);
    };

    const userId = localStorage.getItem("account_id");
    if (!notice || !userId || userId === "guest") return null;

    // Dynamic color coding based on title
    const nTitle = (notice.title || "").toLowerCase();
    const isError = nTitle.includes("rejected") || nTitle.includes("error") || nTitle.includes("failed") || nTitle.includes("limit");
    const isSuccess = nTitle.includes("won") || nTitle.includes("bonus") || nTitle.includes("success") || nTitle.includes("congratulations");
    
    const statusColor = isError ? "#ff4d4d" : (isSuccess ? "#00ff88" : COLORS.brand);
    const StatusIcon = isError ? FaTimes : FaBell;

    return (
        <AnimatePresence>
            <div className="fixed top-24 right-4 z-[9999] w-full max-w-[340px]">
                <motion.div 
                    initial={{ opacity: 0, x: 100, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.8 }}
                    className="overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-2 backdrop-blur-xl"
                    style={{ 
                        backgroundColor: 'rgba(20, 20, 20, 0.95)',
                        borderColor: statusColor 
                    }}
                >
                    <div className="p-4 flex gap-4 relative">
                        {/* Status specific glow */}
                        <div 
                            className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{ 
                                background: `radial-gradient(circle at 10% 50%, ${statusColor}44 0%, transparent 70%)` 
                            }}
                        ></div>

                        <div 
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 relative z-10 shadow-lg"
                            style={{ 
                                backgroundColor: statusColor, 
                                color: isError || isSuccess ? '#fff' : '#000',
                                boxShadow: `0 0 20px ${statusColor}44`
                            }}
                        >
                            <StatusIcon className={isError ? "animate-pulse" : "animate-bounce-subtle"} />
                        </div>
                        
                        <div className="flex-grow min-w-0 relative z-10 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-1">
                                <h3 
                                    className="text-[13px] font-black uppercase tracking-wider drop-shadow-sm truncate pr-6"
                                    style={{ color: statusColor }}
                                >
                                    {notice.title}
                                </h3>
                                <button 
                                    onClick={dismissToast}
                                    className="text-white/40 hover:text-white transition-colors absolute top-0 right-0 p-1"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>
                            <p className="text-[12px] text-white/90 leading-snug font-semibold drop-shadow-sm">
                                {notice.message}
                            </p>
                        </div>
                    </div>
                    
                    {/* Dynamic Progress Bar */}
                    <div className="h-1 w-full bg-white/10">
                        <motion.div 
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 10, ease: "linear" }}
                            className="h-full"
                            style={{ 
                                backgroundColor: statusColor,
                                boxShadow: `0 0 10px ${statusColor}`
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BroadcastModal;
