import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notificationPermission, setNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const [isSubscribedToPush, setIsSubscribedToPush] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Check PWA mode
  const isPWAMode = window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && window.navigator.standalone);

  const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';

  useEffect(() => {
    // Check if app is already installed
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isNavigatorStandalone = 'standalone' in window.navigator && window.navigator.standalone;
      setIsInstalled(isStandalone || isNavigatorStandalone);
    };

    checkInstallStatus();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showInstallPrompt = async () => {
    if (!deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    try {
      console.log('Showing install prompt');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('User choice:', outcome);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      
      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  };

  const updateApp = () => {
    setIsUpdating(true);
    try {
      // Reload the page to get the new version
      window.location.reload();
      setLastUpdated(new Date());
      setHasUpdate(false);
    } catch (error) {
      console.error('Failed to update app:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  };

  const subscribeToPush = async () => {
    try {
      const permission = await requestNotificationPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission required');
      }

      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'your-vapid-public-key' // Replace with your VAPID key
        });
        
        setIsSubscribedToPush(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          await subscription.unsubscribe();
          setIsSubscribedToPush(false);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  };

  return {
    // Installation
    isInstallable,
    isInstalled,
    showInstallPrompt,
    
    // Update
    hasUpdate,
    isUpdating,
    updateApp,
    
    // Connection
    isOnline,
    
    // PWA state
    isPWAMode,
    
    // Notification
    notificationPermission,
    requestNotificationPermission,
    
    // Push notifications
    isSubscribedToPush,
    subscribeToPush,
    unsubscribeFromPush,
    
    // App info
    appVersion,
    lastUpdated
  };
};

export default usePWA;