import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '@/utils/constants';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const INITIAL_ACCOUNT_INFO = {
    service_site_name: "Winco",
    service_site_logo: "/wincologo.png",
    service_tagline: "PLAY · WIN · REPEAT",
    service_app_download_url: "https://winco.cc/Winco.apk",
    service_support_url: "https://t.me/winco_support"
  };

  const [accountInfo, setAccountInfo] = useState(INITIAL_ACCOUNT_INFO);
  const [promoBanners, setPromoBanners] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    console.warn("Logging out user...");
    localStorage.clear();
    setAccountInfo(INITIAL_ACCOUNT_INFO);
    setShowLogin(true);
    // Force a reload if necessary, but state update should trigger re-renders
    window.dispatchEvent(new Event('site-data-refresh'));
  };

  const fetchSiteData = async () => {
    const userId = localStorage.getItem("account_id") || "guest";
    const authSecretKey = localStorage.getItem("auth_secret_key") || "guest";
    
    // If one is present but other is missing, clean up
    if (userId !== "guest" && authSecretKey === "guest") {
      logout();
      return;
    }

    try {
      const response = await fetch(API_URL + "?USER_ID=" + userId + "&_t=" + Date.now(), {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Route: "route-account-info",
          AuthToken: authSecretKey,
        },
      });

      const result = await response.json();
      if (result.status_code === "success") {
        if (result.data && result.data[0]) {
          setAccountInfo(result.data[0]);
        }
        
        // Handle System Notices / Popups
        if (result.noticeArr && result.noticeArr.length >= 2) {
          const nTitle = result.noticeArr[0];
          const nMsg = result.noticeArr[1];
          const nHash = btoa(nTitle + nMsg).substring(0, 32); 
          
          const acknowledgedNotices = JSON.parse(localStorage.getItem("acknowledged_notices") || "[]");
          const shownToasts = JSON.parse(localStorage.getItem("shown_toasts") || "[]");
          const allNotifications = JSON.parse(localStorage.getItem("notifications_history") || "[]");

          // Add to history if new
          const isExisting = allNotifications.some(n => n.id === nHash);
          if (!isExisting) {
            allNotifications.unshift({ id: nHash, title: nTitle, message: nMsg, time: new Date().toISOString() });
            localStorage.setItem("notifications_history", JSON.stringify(allNotifications.slice(0, 50))); 
          }

          // Only show toast if not acknowledged AND not already shown as a toast in this session/state
          if (!acknowledgedNotices.includes(nHash) && !shownToasts.includes(nHash)) {
            setNotice({ 
              id: nHash,
              title: nTitle, 
              message: nMsg 
            });
          }
        }
        
        // Normalize Promo Banners
        const rawPromo = result.promo_banners || [];
        const normalizedPromo = rawPromo.map(banner => ({
          image_path: banner.image_path || banner.image || banner.promo_img,
          action_url: banner.action_url || banner.action || banner.promo_action
        }));
        setPromoBanners(normalizedPromo);
        
        // Normalize Hero Banners
        const rawHero = result.hero_banners || result.slideShowList || [];
        const normalizedHero = rawHero.map(banner => ({
          image_path: banner.image_path || banner.slider_img || banner.tbl_slider_img || banner.image,
          action_url: banner.action_url || banner.slider_action || banner.tbl_slider_action || banner.action
        }));
        setHeroBanners(normalizedHero);
      } else {
        // If server returns ANYTHING other than "success" for a logged-in user, clear session
        if (userId !== "guest") {
          console.warn("Server side auth rejection or error, logging out");
          logout();
        }
      }
    } catch (error) {
      console.error("Error fetching site data:", error);
      // Optional: don't logout on network error, only on explicit server rejection
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteData();

    // Periodic check every 5 seconds to ensure session is still valid
    const interval = setInterval(() => {
      fetchSiteData();
    }, 5000);
    
    // Listen for login/logout to refresh data (cross-tab)
    const handleStorageChange = (e) => {
      if (e.key === "auth_secret_key" || e.key === "account_id") {
        fetchSiteData();
      }
    };

    // Listen for custom refresh events (same-tab)
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
