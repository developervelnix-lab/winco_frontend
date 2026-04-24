import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGift, FaArrowLeft, FaClock, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaWpforms } from 'react-icons/fa';
import { useColors } from '../../hooks/useColors';
import { FONTS } from '../../constants/theme';
import { API_URL } from '../../utils/constants';
import { useSite } from '../../context/SiteContext';
import Navbar from '../navbar/Navbar';

const ActiveBonusPage = () => {
    const navigate = useNavigate();
    const COLORS = useColors();
    const { refreshSiteData, accountInfo } = useSite();
    const hasWagering = accountInfo ? Number(accountInfo.tbl_requiredplay_balance) > 0 : false;
    const activeBonusId = accountInfo ? Number(accountInfo.tbl_active_bonus_id) : 0;
    
    const [bonusData, setBonusData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    const fetchActiveBonusDetails = async () => {
        const userId = localStorage.getItem('account_id');
        const authSecretKey = localStorage.getItem('auth_secret_key');

        if (!userId || !authSecretKey) {
            navigate('/');
            return;
        }

        try {
            const response = await fetch(`${API_URL}?USER_ID=${userId}`, {
                headers: { 
                    "Route": "route-active-bonus-details", 
                    "AuthToken": authSecretKey 
                }
            });
            const result = await response.json();
            if (result.status === "success") {
                setBonusData(result.data);
            } else {
                // If no active bonus metadata, only redirect if there's no active bonus ID lock
                if (result.status_code === "no_active_bonus" && !(activeBonusId > 0)) {
                    navigate('/promotion');
                }
            }
        } catch (err) {
            console.error("Error fetching active bonus:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveBonusDetails();
    }, []);

    const handleCancelBonus = async () => {
        if (!window.confirm("Are you sure you want to cancel this bonus? Your bonus balance and wagering progress will be lost forever.")) return;
        
        const authSecretKey = localStorage.getItem('auth_secret_key');
        const userId = localStorage.getItem('account_id');

        setCancelling(true);
        try {
            const response = await fetch(`${API_URL}?USER_ID=${userId}`, {
                headers: { 
                    "Route": "request-cancel-bonus", 
                    "AuthToken": authSecretKey 
                }
            });
            const result = await response.json();
            
            if (result.status === "success") {
                alert(result.message);
                refreshSiteData(); 
                navigate('/promotion');
            } else {
                alert(result.message || 'Cancellation failed');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        } finally {
            setCancelling(false);
        }
    };



    if (!bonusData) {
        if (hasWagering && activeBonusId > 0) {
            return (
                <div className="min-h-screen pb-20" style={{ backgroundColor: COLORS.bg }}>
                    <Navbar />
                    <div className="max-w-4xl mx-auto px-4 pt-10 text-center">
                        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6 text-amber-500 text-3xl">
                            <FaExclamationCircle />
                        </div>
                        <h1 className="text-2xl font-black uppercase mb-2">Pending Wagering Lock</h1>
                        <p className="text-xs opacity-50 mb-8 max-w-md mx-auto">
                            System detected a remaining wagering requirement of <span className="text-amber-500 font-bold text-sm">₹{Number(accountInfo.tbl_requiredplay_balance).toLocaleString()}</span> from a previous promotion. 
                            You must clear this before claiming new bonuses.
                        </p>
                        
                        <div className="flex flex-col gap-3 items-center">
                            <button 
                                onClick={handleCancelBonus}
                                disabled={cancelling}
                                className="px-10 py-3 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {cancelling ? 'Clearing Lock...' : 'Clear Wagering Lock'}
                            </button>
                            <button 
                                onClick={() => navigate('/promotion')}
                                className="text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                            >
                                Back to Promotions
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: COLORS.bg }}>
                <FaExclamationCircle className="text-4xl mb-4 opacity-20" />
                <h2 className="text-xl font-black uppercase mb-2">No Active Bonus</h2>
                <p className="text-xs opacity-50 mb-6">You don't have any active wagering requirements at the moment.</p>
                <button 
                    onClick={() => navigate('/promotion')}
                    className="px-8 py-3 rounded-2xl bg-brand text-white font-black uppercase tracking-widest text-[10px] shadow-xl"
                    style={{ background: COLORS.brandGradient }}
                >
                    View Promotions
                </button>
            </div>
        );
    }

    const wagering_req = Number(bonusData.wagering_required);
    const wagering_rem = Number(bonusData.current_remaining_wagering);
    const wagering_done = Math.max(0, wagering_req - wagering_rem);
    const progressPercent = wagering_req > 0 ? Math.min(100, (wagering_done / wagering_req) * 100) : 100;

    return (
        <div className="min-h-screen pb-20" style={{ backgroundColor: COLORS.bg }}>
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 pt-4">
                {/* Header Section */}
                <div className="flex items-center gap-3 mb-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-brand hover:text-white transition-all"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight" style={{ fontFamily: FONTS.head }}>
                            Bonus <span style={{ color: COLORS.brand }}>Tracker</span>
                        </h1>
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Monitor your active promotion progress</p>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="p-4 md:p-5 rounded-[1.2rem] border border-black/10 dark:border-white/10 shadow-3xl mb-4 relative overflow-hidden" 
                     style={{ backgroundColor: COLORS.bg2 }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand text-xl shadow-inner">
                                <FaGift />
                            </div>
                            <div>
                                <h2 className="text-base font-black uppercase leading-tight">{bonusData.title || bonusData.name}</h2>
                                <span className="px-2 py-0.5 rounded-full bg-brand/20 text-brand text-[7px] font-black uppercase tracking-widest border border-brand/30">
                                    {bonusData.bonus_category} Exclusive
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Bonus Balance</p>
                            <h3 className="text-2xl font-black tracking-tighter" style={{ color: COLORS.brand }}>₹{Number(bonusData.current_bonus_balance).toLocaleString()}</h3>
                        </div>
                    </div>

                    {/* Progress Bar Rendering */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Wagering Progress</span>
                            <span className="text-xs font-black text-brand" style={{ color: COLORS.brand }}>{progressPercent.toFixed(1)}%</span>
                        </div>
                        <div className="h-4 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                            <div 
                                className="h-full rounded-full bg-brand relative shadow-lg transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercent}%`, background: COLORS.brandGradient }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-[8px] font-bold opacity-30 uppercase tracking-widest">
                            <span>Completed: ₹{wagering_done.toLocaleString()}</span>
                            <span>Required: ₹{wagering_req.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Information Table */}
                <div className="rounded-[1.2rem] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden" style={{ backgroundColor: COLORS.bg2 }}>
                    <div className="px-5 py-2.5 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
                        <FaWpforms className="text-brand opacity-50" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest">Full Bonus Details</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody>
                                {[
                                    { label: 'Promotion Name', value: bonusData.title || bonusData.name },
                                    { label: 'Promotion Type', value: bonusData.type, isBadge: true },
                                    { label: 'Initial Bonus Granted', value: `₹${Number(bonusData.bonus_amount).toLocaleString()}` },
                                    { label: 'Total Wagering Required', value: `₹${Number(bonusData.wagering_required).toLocaleString()}` },
                                    { label: 'Wagering Completed', value: `₹${wagering_done.toLocaleString()}`, color: 'text-emerald-500' },
                                    { label: 'Wagering Remaining', value: `₹${wagering_rem.toLocaleString()}`, color: 'text-rose-500' },
                                    { label: 'Claimed On', value: new Date(bonusData.claim_date).toLocaleString() },
                                    { label: 'Expires At', value: new Date(bonusData.end_at).toLocaleString(), icon: <FaClock className="text-brand/50 mt-0.5" /> }
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-5 py-2.5 text-[9px] font-black uppercase tracking-wider opacity-40 whitespace-nowrap w-1/2">
                                            {row.label}
                                        </td>
                                        <td className={`px-5 py-2.5 text-[10px] font-bold tracking-wide whitespace-nowrap text-right ${row.color || ''}`}>
                                            <div className="flex items-center justify-end gap-2">
                                                {row.isBadge ? (
                                                    <span className="px-2 py-0.5 rounded-lg bg-black/10 dark:bg-white/10 text-[8px] uppercase">
                                                        {row.value}
                                                    </span>
                                                ) : (
                                                    <>
                                                        {row.icon}
                                                        {row.value}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions and Info Stacked */}
                <div className="mt-6 flex flex-col items-center gap-4">
                    <button 
                        onClick={handleCancelBonus}
                        disabled={cancelling}
                        className="py-2.5 px-8 rounded-xl bg-red-500/10 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        <FaClock className="group-hover:animate-pulse text-[10px]" />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                            {cancelling ? 'Cancelling...' : 'Cancel Active Bonus'}
                        </span>
                    </button>

                    <div className="max-w-2xl w-full p-5 rounded-2xl bg-brand/5 border border-brand/20 flex gap-4">
                        <FaInfoCircle className="text-brand text-xl mt-0.5" style={{ color: COLORS.brand }} />
                        <div>
                            <h4 className="text-[11px] font-black uppercase mb-1">Important Note</h4>
                            <p className="text-[10px] leading-relaxed opacity-60">
                                Once the wagering requirement reaches ₹0, your remaining bonus balance will be automatically transferred to your real balance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveBonusPage;
