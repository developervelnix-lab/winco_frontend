import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '@/utils/constants';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  // 1. Get initial auth tokens from storage immediately
  const initialUserId = (typeof window !== 'undefined' && localStorage.getItem("account_id")) || "guest";
  const initialAuthToken = (typeof window !== 'undefined' && localStorage.getItem("auth_secret_key")) || "guest";

  // 2. Build initial state from defaults + local session + cached data
  const INITIAL_ACCOUNT_INFO = {
    service_site_name: "Velplay365",
    service_site_logo: "/image.png",
    service_tagline: "PLAY · WIN · REPEAT",
    service_marquee: "Welcome to Velplay365! Experience world-class betting and gaming. Sign up now to get exclusive bonuses and daily rewards. Minimum deposit ₹100. Fast 24/7 withdrawals.",
    service_app_download_url: "https://velplay.cc/Velplay.apk",
    service_support_url: "https://t.me/velplay_support",
    account_id: initialUserId !== "guest" ? initialUserId : "guest",
    account_username: initialUserId !== "guest" ? "User" : "Guest",
    account_balance: initialUserId !== "guest" ? "0.00" : "0.00",
  };

  const DEFAULT_HERO_BANNERS = [
    { image_path: "/banner/photo_6316855436321165721_y.jpg", action_url: "#" },
    { image_path: "/banner/photo_6316855436321165722_y.jpg", action_url: "#" },
    { image_path: "/banner/photo_6316855436321165723_y.jpg", action_url: "#" },
    { image_path: "/banner/photo_6316855436321165724_y.jpg", action_url: "#" }
  ];

  const DEFAULT_PROMO_BANNERS = [
    { image_path: "/banner/photo_6316855436321165721_y.jpg", action_url: "#" },
    { image_path: "/banner/photo_6316855436321165722_y.jpg", action_url: "#" }
  ];

  // Try to load from cache on initialization to prevent flicker
  const [accountInfo, setAccountInfo] = useState(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem("cached_site_info") : null;
    if (cached) {
      try { return { ...INITIAL_ACCOUNT_INFO, ...JSON.parse(cached) }; } catch (e) { return INITIAL_ACCOUNT_INFO; }
    }
    return INITIAL_ACCOUNT_INFO;
  });

  const [promoBanners, setPromoBanners] = useState(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem("cached_promo_banners") : null;
    if (cached) {
      try { 
        const parsed = JSON.parse(cached);
        if (parsed.length > 0 && parsed[0].image_path?.includes('unsplash.com')) {
          return DEFAULT_PROMO_BANNERS;
        }
        return parsed; 
      } catch (e) { return DEFAULT_PROMO_BANNERS; }
    }
    return DEFAULT_PROMO_BANNERS;
  });

  const [heroBanners, setHeroBanners] = useState(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem("cached_hero_banners") : null;
    if (cached) {
      try { 
        const parsed = JSON.parse(cached);
        // If cache is old unsplash, use new defaults
        if (parsed.length > 0 && parsed[0].image_path?.includes('unsplash.com')) {
          return DEFAULT_HERO_BANNERS;
        }
        return parsed; 
      } catch (e) { return DEFAULT_HERO_BANNERS; }
    }
    return DEFAULT_HERO_BANNERS;
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    console.warn("Logging out user...");
    localStorage.removeItem("auth_secret_key");
    localStorage.removeItem("account_id");
    localStorage.removeItem("cached_site_info"); // Clear cached sensitive info
    setAccountInfo(INITIAL_ACCOUNT_INFO);
    setShowLogin(true);
    window.dispatchEvent(new Event('site-data-refresh'));
  };

  const fetchSiteData = async () => {
    const userId = localStorage.getItem("account_id") || "guest";
    const authSecretKey = localStorage.getItem("auth_secret_key") || "guest";
    
    if (userId !== "guest" && authSecretKey === "guest") {
      logout();
      return;
    }

    let fetchUrl = "";
    try {
      fetchUrl = `${API_URL}?Route=route-account-info&AuthToken=${encodeURIComponent(authSecretKey)}&USER_ID=${encodeURIComponent(userId)}&_t=${Date.now()}`;
      
      const response = await fetch(fetchUrl, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Route: "route-account-info",
          AuthToken: authSecretKey,
        },
      });

      const result = await response.json();
      console.log("✅ [SiteContext] API Response:", result);

      if (result.status_code === "success" && result.data && result.data[0]) {
        const serverData = result.data[0];
        const isLoggedIn = userId !== "guest" && authSecretKey !== "guest";
        const serverReturnedGuest = !serverData.account_balance || 
          (serverData.account_username === "Guest" && parseFloat(serverData.account_balance) === 0);
        
        setAccountInfo(prev => {
          const cleanServerData = {};
          Object.keys(serverData).forEach(key => {
            // Allow empty strings for branding fields to enable clearing them via backend
            if (serverData[key] !== null && serverData[key] !== undefined) {
              cleanServerData[key] = serverData[key];
            }
          });

          const mergedInfo = { 
            ...prev, 
            ...cleanServerData, 
            service_site_name: "Velplay365", 
            service_site_logo: "/image.png",
            service_marquee: "Welcome to Velplay365! Experience world-class betting and gaming. Sign up now to get exclusive bonuses and daily rewards. Minimum deposit ₹100. Fast 24/7 withdrawals."
          };
          
          let finalInfo = mergedInfo;
          if (isLoggedIn && serverReturnedGuest) {
            finalInfo = {
              ...mergedInfo,
              account_id: prev.account_id || userId,
              account_username: (prev.account_username && prev.account_username !== "Guest") ? prev.account_username : "User",
              account_balance: prev.account_balance || "0.00",
            };
          }
          
          localStorage.setItem("cached_site_info", JSON.stringify(finalInfo));
          return finalInfo;
        });

        // Normalize and Update Banners with Caching
        // Ignore server-side banners as requested, strictly use local defaults
        console.log("🚀 [SiteContext] Forcing local banners:", DEFAULT_HERO_BANNERS);
        setPromoBanners(DEFAULT_PROMO_BANNERS);
        setHeroBanners(DEFAULT_HERO_BANNERS);
        localStorage.removeItem("cached_promo_banners");
        localStorage.removeItem("cached_hero_banners");

        // Handle System Notices
        if (result.noticeArr && result.noticeArr.length >= 2) {
          const nTitle = result.noticeArr[0];
          const nMsg = result.noticeArr[1];
          const nHash = btoa(nTitle + nMsg).substring(0, 32); 
          const acknowledgedNotices = JSON.parse(localStorage.getItem("acknowledged_notices") || "[]");
          const shownToasts = JSON.parse(localStorage.getItem("shown_toasts") || "[]");
          if (!acknowledgedNotices.includes(nHash) && !shownToasts.includes(nHash)) {
            setNotice({ id: nHash, title: nTitle, message: nMsg });
          }
        }
      }
    } catch (error) {
      console.error("❌ [SiteContext] API Fetch Failed for URL:", fetchUrl);
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteData();

    const interval = setInterval(() => {
      fetchSiteData();
    }, 5000);
    
    const handleStorageChange = (e) => {
      if (e.key === "auth_secret_key" || e.key === "account_id") {
        fetchSiteData();
      }
    };

    const handleCustomRefresh = () => {
      fetchSiteData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("site-data-refresh", handleCustomRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("site-data-refresh", handleCustomRefresh);
    };
  }, []);

  return (
    <SiteContext.Provider value={{ 
      accountInfo, 
      promoBanners, 
      heroBanners,
      loading, 
      notice,
      setNotice,
      refreshSiteData: fetchSiteData,
      logout,
      showLogin,
      setShowLogin,
      showRegister,
      setShowRegister
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
};
