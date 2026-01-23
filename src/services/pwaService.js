/**
 * PWA Service
 * Handles Progressive Web App functionality
 */

class PWAService {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.hasUpdate = false;
    this.isOnline = navigator.onLine;
    this.notificationPermission = Notification.permission;
    
    this.initialize();
  }

  initialize() {
    // Check if app is installed
    this.checkInstallStatus();
    
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Register service worker
    this.registerServiceWorker();
  }

  checkInstallStatus() {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isNavigatorStandalone = 'standalone' in window.navigator && window.navigator.standalone;
    
    this.isInstalled = isStandalone || isNavigatorStandalone;
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                this.hasUpdate = true;
              }
            }
          });
        });

        console.log('Service Worker registered successfully');
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
      }
    }
  }

  async showInstallPrompt() {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.isInstalled = true;
      }
      
      this.deferredPrompt = null;
      return outcome === 'accepted';
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }

  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      return permission;
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return 'denied';
    }
  }

  async updateApp() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }

  // Push notification subscription
  async subscribeToPushNotifications() {
    try {
      const permission = await this.requestNotificationPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        return existingSubscription;
      }

      // Create new subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      throw error;
    }
  }

  async unsubscribeFromPushNotifications() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Push unsubscribe failed:', error);
      throw error;
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  getInstallPromptAvailable() {
    return !!this.deferredPrompt;
  }

  getConnectionStatus() {
    return this.isOnline;
  }

  getInstallStatus() {
    return this.isInstalled;
  }

  getUpdateStatus() {
    return this.hasUpdate;
  }

  getNotificationPermission() {
    return this.notificationPermission;
  }
}

export default new PWAService();