import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaTag, FaGift, FaInfoCircle } from 'react-icons/fa';
import { useColors } from '../../../hooks/useColors';
import { FONTS } from '../../../constants/theme';
import { API_URL } from '../../../utils/constants';
import { useSite } from '../../../context/SiteContext';
import { useTheme } from '../../../context/ThemeContext';

const PromotionCard = ({ id, title, description, endDate, image, promo_type, onClick, isActive }) => {
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
          src={image ? (image.startsWith('http') ? image : `${API_URL.replace('router/', '')}${image}`) : ''}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        {/* Badge */}
        <div className="absolute top-2 left-2 md:top-2.5 md:left-2.5 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-[6px] md:text-[7px] font-black uppercase tracking-widest border flex items-center gap-1 md:gap-1.5 shadow-xl"
          style={{ background: `${COLORS.brand}20`, borderColor: `${COLORS.brand}40`, color: COLORS.brand }}>
          <FaTag className="text-[6px] md:text-[7px]" />
          OFFER
        </div>
      </div>
      <div className="p-2 md:p-3 flex flex-col flex-1">
        <h3 className="text-[8px] md:text-[10px] font-black text-black/70 dark:text-white/70 uppercase tracking-wide mb-0.5" style={{ fontFamily: FONTS.head }}>
          {description}
        </h3>
        <h3 className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-wide mb-0.5 flex-1" style={{ fontFamily: FONTS.head }}>
          {title}
        </h3>
        <p className="text-[8px] md:text-[9px] font-bold uppercase text-black/30 dark:text-white/30 tracking-widest mb-2">
          Limited Time Offer
        </p>

        <button
          onClick={onClick}
          className="w-full px-2 py-1.5 md:py-2 rounded-lg font-black uppercase tracking-widest text-[8px] md:text-[9px] text-black dark:text-white shadow-lg active:scale-95 transition-all duration-300 relative overflow-hidden group/btn"
          style={{ background: COLORS.brandGradient, fontFamily: FONTS.ui }}
        >
          <div className="absolute inset-0 bg-gray-100 dark:bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          <span className="relative">View Offer</span>
        </button>
      </div>
    </div>
  );
};

const Promotion = () => {
  const navigate = useNavigate();
  const COLORS = useColors();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { refreshSiteData } = useSite();

  const [activeTab, setActiveTab] = useState('all');
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = () => {
    const url = new URL(API_URL);
    url.searchParams.append('_t', Date.now().toString());

    fetch(url.toString(), {
      method: "GET",
      headers: { "Route": "route-offer-promotions", "AuthToken": "guest", "Content-Type": "application/json" }
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
    fetchPromotions();
  }, []);

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
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">No active promotions</p>
        </div>
      );
    }

    const visiblePromotions = promotions.filter(p => {
      const cat = (p.category || '').toLowerCase();
      return activeTab === 'all' || cat === 'all' || cat === activeTab;
    });

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 px-2">
        {visiblePromotions.map((promo) => (
          <PromotionCard
            key={promo.id}
            id={promo.id}
            title={promo.title}
            description={promo.description}
            endDate={promo.end_date}
            image={promo.image_path}
            promo_type={promo.promo_type}
            onClick={() => {}}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-[98%] md:w-[96%] max-w-[1240px] mx-auto overflow-hidden rounded-xl md:rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl relative mb-6"
      style={{ backgroundColor: COLORS.bg2 }}>
      <div className="p-2 md:p-3.5 border-b border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shadow-lg text-black dark:text-white text-base"
            style={{ background: COLORS.brandGradient }}>
            <FaCrown className="text-xs md:text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-md md:text-lg font-black uppercase tracking-tight text-black dark:text-white" style={{ fontFamily: FONTS.head }}>
              Special <span style={{ color: COLORS.brand }}>Promotions</span>
            </h2>
            <div className="w-[1.5px] h-3 bg-black/10 dark:bg-white/10 hidden sm:block"></div>
            <span className="hidden sm:inline-block text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">Exclusive Offers & Rewards</span>
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

      <div className={`mx-2 md:mx-4 mb-4 p-4 md:p-6 rounded-2xl border backdrop-blur-sm transition-all ${isDark ? 'bg-brand/5 border-brand/20' : 'bg-brand/5 border-brand/10'}`}>
          <div className="flex items-start gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand/20 flex items-center justify-center shrink-0 text-brand text-lg md:text-xl" style={{ color: COLORS.brand }}>
            <FaInfoCircle />
          </div>
          <div>
            <h4 className="text-[10px] md:text-[12px] font-black uppercase tracking-tight mb-1 text-black dark:text-white">Promotion Notice</h4>
            <p className="text-[9px] md:text-[10px] font-bold leading-relaxed text-black/40 dark:text-white/40">
              Check out our latest exclusive offers and promotions. These are limited-time rewards available to all eligible members. Simply click on an offer to learn more about how to participate!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotion;
