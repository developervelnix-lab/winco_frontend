import { useState, useEffect } from 'react';

/**
 * Hook to handle PWA installation prompt logic.
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState('desktop');

  useEffect(() => {
    // Platform Detection
    const getPlatform = () => {
      const ua = navigator.userAgent;
      if (/android/i.test(ua)) return 'android';
      if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
      return 'desktop';
    };
    setPlatform(getPlatform());

    const checkInstalled = async () => {
      // 1. Check if we are currently running in standalone mode (installed view)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }

      // 2. Use the getInstalledRelatedApps API (Chrome/Edge Only)
      if ('getInstalledRelatedApps' in navigator) {
        try {
          const relatedApps = await navigator.getInstalledRelatedApps();
          if (relatedApps.length > 0) {
            setIsInstalled(true);
          }
        } catch (err) {
          console.log('Error checking installed apps:', err);
        }
      }
    };

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    checkInstalled();

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return { isInstallable, isInstalled, installApp, platform };
};
