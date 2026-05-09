import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaTag, FaGift, FaInfoCircle } from 'react-icons/fa';
import { useColors } from '../../../hooks/useColors';
import { FONTS } from '../../../constants/theme';
import { API_URL, URL as BASE_URL } from '../../../utils/constants';
import { useSite } from '../../../context/SiteContext';
import { useTheme } from '../../../context/ThemeContext';

const BonusCard = ({ id, title, description, endDate, image, promo_type, pending_amount, onClick, onClaim, isActive }) => {
  const COLORS = useColors();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="bg-gray-100 dark:bg-black border border-black/5 dark:border-white/5 rounded-xl overflow-hidden group hover:border-brand/20 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[3/2] md:aspect-video overflow-hidden">
        <img
          src={image ? (image.startsWith('http') ? image : `${BASE_URL}${image}`) : ''}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        {/* Badge */}
        <div className="absolute top-2 left-2 md:top-2.5 md:left-2.5 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-[6px] md:text-[7px] font-black uppercase tracking-widest border flex items-center gap-1 md:gap-1.5 shadow-xl"
          style={promo_type === 'cashback' ? { background: '#f43f5e20', borderColor: '#f43f5e40', color: '#f43f5e' } : { background: `${COLORS.brand}20`, borderColor: `${COLORS.brand}40`, color: COLORS.brand }}>
          {promo_type === 'cashback' ? <FaCrown className="text-[6px] md:text-[7px]" /> : <FaTag className="text-[6px] md:text-[7px]" />}
          {promo_type === 'cashback' ? 'CASHBACK' : 'BONUS'}
        </div>

        {isActive && (
          <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-[6px] md:text-[7px] font-black uppercase tracking-widest bg-emerald-500 border border-emerald-400 text-white shadow-xl animate-pulse">
            ACTIVE
          </div>
        )}
      </div>
      <div className="p-2 md:p-3 flex flex-col flex-1">
        <h3 className="text-[8px] md:text-[10px] font-black text-black/70 dark:text-white/70 uppercase tracking-wide mb-0.5" style={{ fontFamily: FONTS.head }}>
          {description}
        </h3>
        <h3 className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-wide mb-0.5 flex-1" style={{ fontFamily: FONTS.head }}>
          {title}
        </h3>
        <p className="text-[8px] md:text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest mb-2">
          Expires in {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m
        </p>

        {pending_amount > 0 ? (
          <button
            onClick={(e) => { e.stopPropagation(); onClaim(); }}
            className="w-full px-2 py-1.5 md:py-2 rounded-lg font-black uppercase tracking-widest text-[8px] md:text-[9px] text-white shadow-lg active:scale-95 transition-all duration-300 relative overflow-hidden group/btn"
            style={{ background: 'linear-gradient(90deg, #10b981, #059669)', fontFamily: FONTS.ui }}
          >
            <span className="relative">CLAIM ₹{pending_amount} NOW!</span>
          </button>
        ) : isActive ? (
          <button
            onClick={(e) => { e.stopPropagation(); navigate('/active-bonus'); }}
            className="w-full px-2 py-1.5 md:py-2 rounded-lg font-black uppercase tracking-widest text-[8px] md:text-[9px] text-white shadow-lg active:scale-95 transition-all duration-300 relative overflow-hidden group/btn"
            style={{ background: 'linear-gradient(90deg, #10b981, #059669)', fontFamily: FONTS.ui }}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            <span className="relative">Active / View Details</span>
          </button>
        ) : (
          <button
            onClick={onClick}
            className="w-full px-2 py-1.5 md:py-2 rounded-lg font-black uppercase tracking-widest text-[8px] md:text-[9px] text-black dark:text-white shadow-lg active:scale-95 transition-all duration-300 relative overflow-hidden group/btn"
            style={{ background: COLORS.brandGradient, fontFamily: FONTS.ui }}
          >
            <div className="absolute inset-0 bg-gray-100 dark:bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            <span className="relative">Claim Bonus</span>
          </button>
        )}
      </div>
    </div>
  );
};

const Bonus = () => {
  const navigate = useNavigate();
  const COLORS = useColors();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { accountInfo, refreshSiteData, loading: siteLoading } = useSite();
  const activeBonusId = parseInt(accountInfo?.tbl_active_bonus_id || 0);
  const hasWagering = parseFloat(accountInfo?.tbl_requiredplay_balance || 0) > 0.01;

  const [activeTab, setActiveTab] = useState('all');
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const activeBonusData = promotions.find(p => Number(p.id) === activeBonusId);

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

  const fetchPromotions = () => {
    const userId = localStorage.getItem("account_id");
    
    const url = new URL(API_URL);
    url.searchParams.append('_t', Date.now().toString());
    if (userId) {
      url.searchParams.append('USER_ID', userId);
    }

    fetch(url.toString(), {
      method: "GET",
      headers: { "Route": "route-active-promotions", "AuthToken": "guest", "Content-Type": "application/json" }
    })
      .then(res => res.text())
      .then(text => {
        const jsonStart = text.indexOf('{');
        if (jsonStart === -1) throw new Error("Invalid JSON response");
        const cleanJson = text.slice(jsonStart);
        return JSON.parse(cleanJson);
      })
      .then(data => {
        if (data.status === "success") {
          setPromotions(data.promotions);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("DEBUG: Fetch Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshSiteData(); // Force refresh account info when visiting bonuses
    fetchPromotions();
  }, []);

  const handleClaim = (logId, amount) => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) return alert("Please login to claim");

    setLoading(true);
    const formData = new FormData();
    formData.append("USER_ID", user_id);
    formData.append("LOG_ID", logId);

    fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Route": "route-claim-cashback", "AuthToken": "guest" },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchPromotions();
      })
      .catch(() => {
        alert("Something went wrong!");
        setLoading(false);
      });
  };

  const renderPromotions = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 rounded-full border-2 border-t-brand animate-spin" style={{ borderColor: `${COLORS.brand}40`, borderTopColor: COLORS.brand }}></div>
        </div>
      );
    }

    if (promotions.length === 0) {
      return (
        <div className="text-center py-10">
          <i className="bx bx-ghost text-4xl mb-3 opacity-30 dark:text-white text-black"></i>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">No active bonuses</p>
        </div>
      );
    }

    const now = new Date();
    const visiblePromotions = promotions.filter(p => {
      const cat = (p.category || '').toLowerCase();
      const isCorrectTab = activeTab === 'all' || cat === 'all' || cat === activeTab;
      const isNotExpired = new Date(p.end_date) > now;
      return isCorrectTab && isNotExpired;
    });

    return (
      <>
        {/* --- ACTIVE BONUS TRACKER (SMALL TABLE STYLE) --- */}
        {localStorage.getItem('auth_secret_key') && (activeBonusId > 0 || hasWagering) && (
          <div className={`mb-4 mx-2 p-2.5 md:p-3 rounded-xl border shadow-2xl overflow-hidden relative group transition-all duration-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black/5'}`}>
            <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full bg-emerald-500"></div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-base shadow-inner">
                  <FaGift />
                </div>
                <div>
                  <h3 className={`font-black uppercase tracking-wider text-[10px] md:text-xs leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
                    {activeBonusData?.title || (activeBonusId > 0 ? 'Active Bonus Found' : 'Wagering Lock Active')}
                  </h3>
                  <p className={`${isDark ? 'text-white/40' : 'text-black/40'} text-[8px] md:text-[9px] font-bold uppercase tracking-widest`}>
                    {activeBonusData ? 'Currently Active' : (activeBonusId > 0 ? 'Action Required' : 'System Lock Active')}
                  </p>
                </div>
              </div>

              <div className={`flex justify-between sm:flex-col items-center sm:items-start gap-3 sm:gap-0.5 w-full sm:w-auto p-1.5 sm:p-0 rounded-lg ${isDark ? 'bg-white/5 sm:bg-transparent' : 'bg-black/5 sm:bg-transparent'}`}>
                <span className={`${isDark ? 'text-white/30' : 'text-black/30'} text-[8px] font-black uppercase tracking-widest whitespace-nowrap`}>Wagering Remaining</span>
                <span className="text-emerald-500 font-black text-xs md:text-sm tracking-tighter">₹{Number(accountInfo.tbl_requiredplay_balance).toLocaleString()}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/active-bonus')}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                >
                  View Details
                </button>
                <button
                  onClick={handleCancelBonus}
                  disabled={cancelling}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                >
                  {cancelling ? '...' : 'Clear Lock'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 px-2">
          {visiblePromotions.map((promo) => (
            <BonusCard
              key={promo.id}
              id={promo.id}
              title={promo.title}
              description={promo.description}
              endDate={promo.end_date}
              image={promo.image_path}
              promo_type={promo.promo_type}
              pending_amount={promo.pending_amount}
              isActive={activeBonusId === Number(promo.id) && (hasWagering || promo.promo_type === 'cashback')}
              onClick={() => navigate(promo.action)}
              onClaim={() => handleClaim(promo.log_id, promo.pending_amount)}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="w-[98%] md:w-[96%] max-w-[1240px] mx-auto overflow-hidden rounded-xl md:rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl relative mb-6"
      style={{ backgroundColor: COLORS.bg2 }}>
      <div className="p-2 md:p-3.5 border-b border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shadow-lg text-black dark:text-white text-base"
            style={{ background: COLORS.brandGradient }}>
            <FaGift className="text-xs md:text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-md md:text-lg font-black uppercase tracking-tight text-black dark:text-white" style={{ fontFamily: FONTS.head }}>
              Active <span style={{ color: COLORS.brand }}>Bonuses</span>
            </h2>
            <div className="w-[1.5px] h-3 bg-black/10 dark:bg-white/10 hidden sm:block"></div>
            <span className="hidden sm:inline-block text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">Claim your rewards now</span>
          </div>
        </div>

        <div className="flex bg-gray-100 dark:bg-black p-0.5 rounded-lg border border-black/5 dark:border-white/5 w-full sm:w-fit min-w-[180px]">
          {['all', 'sports', 'casino'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 px-3 py-1.5 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                  ? 'text-black dark:text-white shadow-lg'
                  : 'text-black/20 dark:text-white/20 hover:text-black/50 dark:text-white/50'
                }`}
              onClick={() => setActiveTab(tab)}
              style={activeTab === tab ? { background: COLORS.brandGradient } : {}}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="p-2 md:p-4 relative z-10">
        {renderPromotions()}
      </div>

      {/* Bottom Hint / Info Notice */}
      <div className={`mx-2 md:mx-4 mb-4 p-4 md:p-6 rounded-2xl border backdrop-blur-sm transition-all ${isDark ? 'bg-brand/5 border-brand/20' : 'bg-brand/5 border-brand/10'}`}>
          <div className="flex items-start gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand/20 flex items-center justify-center shrink-0 text-brand text-lg md:text-xl" style={{ color: COLORS.brand }}>
            <FaInfoCircle />
          </div>
          <div>
            <h4 className="text-[10px] md:text-[12px] font-black uppercase tracking-tight mb-1 text-black dark:text-white">Important Note</h4>
            <p className="text-[9px] md:text-[10px] font-bold leading-relaxed text-black/40 dark:text-white/40">
              You can only have one active bonus at a time. Once your current bonus wagering is successfully completed (reaches ₹0), cancelled, or expired, your next selected promotion will be ready to activate immediately!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bonus;
