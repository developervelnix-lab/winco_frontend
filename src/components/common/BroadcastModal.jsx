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
            // Mark as shown immediately to prevent double-triggering during rapid state refreshes
            const shownToasts = JSON.parse(localStorage.getItem("shown_toasts") || "[]");
            if (!shownToasts.includes(notice.id)) {
                shownToasts.push(notice.id);
                localStorage.setItem("shown_toasts", JSON.stringify(shownToasts));
            }

            const timer = setTimeout(() => {
                setNotice(null);
            }, 10000); // 10 seconds
            return () => clearTimeout(timer);
        }
    }, [notice, setNotice]);

    const dismissToast = () => {
        setNotice(null);
    };

    if (!notice) return null;

    return (
        <AnimatePresence>
            <div className="fixed top-20 right-4 z-[9999] w-full max-w-[320px]">
                <motion.div 
                    initial={{ opacity: 0, x: 50, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9, y: -20 }}
                    className="overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2"
                    style={{ 
                        backgroundColor: '#1a1a1a', // Fixed solid dark background for maximum visibility
                        borderColor: COLORS.brand 
                    }}
                >
                    <div className="p-4 flex gap-3 relative">
                        {/* Background subtle glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent pointer-events-none"></div>

                        <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 relative z-10 shadow-lg shadow-brand/20"
                            style={{ backgroundColor: COLORS.brand, color: '#000' }}
                        >
                            <FaBell className="animate-bounce-subtle" />
                        </div>
                        
                        <div className="flex-grow min-w-0 relative z-10">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xs font-black text-white uppercase truncate pr-4 drop-shadow-sm">
                                    {notice.title}
                                </h3>
                                <button 
                                    onClick={dismissToast}
                                    className="text-white/50 hover:text-white transition-colors p-1 -mr-1"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                            <p className="text-[11px] text-white/80 leading-snug font-bold line-clamp-2 drop-shadow-sm">
                                {notice.message}
                            </p>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <motion.div 
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="h-1 shadow-[0_-5px_10px_rgba(230,160,0,0.3)]"
                        style={{ backgroundColor: COLORS.brand }}
                    />
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BroadcastModal;
