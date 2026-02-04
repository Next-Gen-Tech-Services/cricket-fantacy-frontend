import { requestNotificationPermission, onMessageListener } from '../config/firebase';
import { toast } from 'react-hot-toast';

/**
 * Frontend FCM Notification Service
 * Handles token management, permission requests, and message listening
 */
class NotificationService {
    constructor() {
        this.fcmToken = null;
        this.isInitialized = false;
        this.messageListener = null;
        this.apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001';
    }

    /**
     * Initialize the notification service
     * Call this after user login
     */
    async initialize() {
        try {
            console.log('📱 Initializing notification service...');

            // Check if already initialized
            if (this.isInitialized) {
                console.log('✅ Notification service already initialized');
                return true;
            }

            // Check if user is authenticated
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.log('⚠️ User not authenticated - notification service not initialized');
                return false;
            }

            // Check browser support
            if (!('Notification' in window)) {
                console.warn('⚠️ Browser does not support notifications');
                return false;
            }

            // Check service worker support
            if (!('serviceWorker' in navigator)) {
                console.warn('⚠️ Browser does not support service workers');
                return false;
            }

            // Start listening for foreground messages
            this.startMessageListener();

            // Check current permission status but don't auto-request
            const currentPermission = Notification.permission;
            console.log('🔐 Current notification permission:', currentPermission);

            // Only get token if permission is already granted
            if (currentPermission === 'granted') {
                await this.getAndSaveToken();
            }

            this.isInitialized = true;
            return true;

        } catch (error) {
            console.error('❌ Failed to initialize notification service:', error);
            return false;
        }
    }

    /**
     * Request notification permission from user
     * Only works for authenticated users
     */
    async requestPermission() {
        try {
            // Check if user is authenticated
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.warn('⚠️ User not authenticated - cannot request notification permission');
                toast.error('❌ Please log in first to enable notifications.');
                return { success: false, error: 'User not authenticated' };
            }

            console.log('🔔 Requesting notification permission...');

            const token = await requestNotificationPermission();

            if (token) {
                this.fcmToken = token;
                await this.saveTokenToBackend(token);
                
                // Start message listener if not already listening
                if (!this.isListening()) {
                    console.log('🎧 Starting message listener after permission granted...');
                    this.startMessageListener();
                }

                toast.success('🎉 Notifications enabled! You will receive match alerts and updates.');
                return { success: true, token };
            } else {
                toast.error('❌ Failed to enable notifications. Please check browser settings.');
                return { success: false, error: 'Permission denied or token generation failed' };
            }

        } catch (error) {
            console.error('❌ Error requesting notification permission:', error);
            toast.error('❌ Error enabling notifications. Please try again.');
            return { success: false, error: error.message };
        }
    }
    /**
     * Get FCM token and save to backend
     */
    async getAndSaveToken() {
        try {
            const token = await requestNotificationPermission();

            if (token) {
                this.fcmToken = token;
                await this.saveTokenToBackend(token);
                console.log('✅ FCM token obtained and saved');
                return token;
            }

            return null;
        } catch (error) {
            console.error('❌ Error getting FCM token:', error);
            return null;
        }
    }

    /**
     * Save FCM token to backend
     */
    async saveTokenToBackend(token) {
        try {
            const deviceType = this.detectDeviceType();

            const response = await fetch(`${this.apiBaseUrl}/push/fcm-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    token,
                    deviceType
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save FCM token');
            }

            const data = await response.json();
            console.log('✅ FCM token saved to backend:', data);

            localStorage.setItem('fcmToken', token);
            return data;

        } catch (error) {
            console.error('❌ Failed to save FCM token to backend:', error);
            throw error;
        }
    }

    /**
     * Remove FCM token from backend
     */
    async removeToken() {
        try {
            if (!this.fcmToken) {
                console.log('📱 No FCM token to remove');
                return true;
            }

            const response = await fetch(`${this.apiBaseUrl}/push/fcm-token`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    token: this.fcmToken
                })
            });

            if (!response.ok) {
                throw new Error('Failed to remove FCM token');
            }

            this.fcmToken = null;
            localStorage.removeItem('fcmToken');
            console.log('✅ FCM token removed');

            return true;

        } catch (error) {
            console.error('❌ Failed to remove FCM token:', error);
            return false;
        }
    }

    /**
     * Send test notification
     */
    async sendTestNotification() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/push/test-fcm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    title: '🏏 Test Notification',
                    body: 'This is a test notification from Cricket Lover Fantasy!'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send test notification');
            }

            const data = await response.json();
            console.log('✅ Test notification sent:', data);

            toast.success('🔔 Test notification sent! Check your device.');
            return data;

        } catch (error) {
            console.error('❌ Failed to send test notification:', error);
            toast.error('❌ Failed to send test notification');
            throw error;
        }
    }

    /**
     * Start listening for foreground messages
     */
    startMessageListener() {
        try {
            console.log('🎧 Starting FCM message listener...');
            
            // Clean up existing listener if any
            if (this.messageListener && typeof this.messageListener === 'function') {
                this.messageListener();
                this.messageListener = null;
            }
            
            // Set up the message listener with callback
            this.messageListener = onMessageListener((payload) => {
                console.log('📨 Received foreground message:', payload);
                
                const { notification, data } = payload;
                
                // Log notification for debugging (production ready)
                console.log('🔔 Notification received:', {
                    title: notification?.title,
                    body: notification?.body,
                    data: data
                });
                
                // Show visual notification
                this.displayNotification(notification, data);
                
                // Handle notification click actions
                this.handleNotificationClick(data);
                
                // Emit custom event for other parts of app to handle if needed
                if (window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('fcm-notification', {
                        detail: { notification, data }
                    }));
                }
            });
            
            console.log('✅ FCM message listener started successfully');
            
        } catch (error) {
            console.error('❌ Failed to start message listener:', error);
            this.messageListener = null;
        }
    }

    /**
     * Display notification visually in the UI
     */
    displayNotification(notification, data) {
        try {
            console.log('🎬 Displaying notification:', notification);
            
            // If browser supports notifications and permission is granted
            if ('Notification' in window && Notification.permission === 'granted') {
                // Create browser notification
                const browserNotif = new Notification(notification?.title || 'Cricket Fantasy Update', {
                    body: notification?.body || 'You have a new update',
                    icon: '/icons/icon-192x192.png',
                    badge: '/icons/icon-72x72.png',
                    tag: data?.type || 'default',
                    data: data
                });

                // Handle click on browser notification
                browserNotif.onclick = () => {
                    console.log('🖱️ Browser notification clicked');
                    this.handleNotificationClick(data);
                    browserNotif.close();
                };

                // Auto close after 8 seconds
                setTimeout(() => {
                    browserNotif.close();
                }, 8000);
            }

            // Also show toast notification
            if (typeof toast !== 'undefined') {
                toast.success(`${notification?.title || 'Update'}: ${notification?.body || 'New notification'}`, {
                    duration: 6000,
                    icon: '🏏'
                });
            }

        } catch (error) {
            console.error('❌ Error displaying notification:', error);
        }
    }

    /**
     * Handle notification click actions
     */
    handleNotificationClick(data) {
        try {
            console.log('🖱️ Handling notification click:', data);
            
            // Focus the window first
            if (window.focus) {
                window.focus();
            }

            // Handle deep links or URLs
            if (data?.deepLink) {
                console.log('🔗 Navigating to deep link:', data.deepLink);
                window.location.href = data.deepLink;
            } else if (data?.url) {
                console.log('🔗 Navigating to URL:', data.url);
                window.location.href = data.url;
            } else if (data?.route) {
                console.log('🔗 Navigating to route:', data.route);
                // For React Router navigation
                if (window.navigate) {
                    window.navigate(data.route);
                }
            }
        } catch (error) {
            console.error('❌ Error handling notification click:', error);
        }
    }

    /**
     * Check current notification permission status
     */
    getPermissionStatus() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }
        return Notification.permission;
    }

    /**
     * Check if message listener is active
     */
    isListening() {
        return this.messageListener !== null && typeof this.messageListener === 'function';
    }

    /**
     * Check if notifications are enabled for authenticated user
     */
    isNotificationEnabled() {
        const authToken = localStorage.getItem('authToken');
        return authToken && this.getPermissionStatus() === 'granted' && this.fcmToken !== null;
    }

    /**
     * Check if user is authenticated
     */
    isUserAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    /**
     * Reset service when user logs out
     */
    resetOnLogout() {
        console.log('🔄 Resetting notification service for logout');
        
        // Stop message listener
        if (this.messageListener) {
            this.messageListener();
            this.messageListener = null;
        }
        
        this.fcmToken = null;
        this.isInitialized = false;
        localStorage.removeItem('fcmToken');
    }

    /**
     * Detect device type for token categorization
     */
    detectDeviceType() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            return 'android';
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'ios';
        }

        return 'web';
    }

    /**
     * Get user's notification tokens from backend
     */
    async getTokens() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/push/fcm-tokens`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get FCM tokens');
            }

            const data = await response.json();
            return data.data;

        } catch (error) {
            console.error('❌ Failed to get FCM tokens:', error);
            return null;
        }
    }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;

// Export individual functions for convenience
export {
    notificationService
};