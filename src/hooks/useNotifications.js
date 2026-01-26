import { useEffect, useState } from 'react';
import { requestNotificationPermission, onMessageListener } from '../config/firebase';
import api from '../services/api';

/**
 * Custom hook to manage Firebase Cloud Messaging (FCM) push notifications
 * 
 * Usage:
 * const { notificationPermission, fcmToken, latestNotification } = useNotifications();
 * 
 * @returns {Object} Notification state and methods
 */
const useNotifications = () => {
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [fcmToken, setFcmToken] = useState(null);
  const [latestNotification, setLatestNotification] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  /**
   * Request notification permission and register FCM token
   */
  const requestPermission = async () => {
    try {
      setIsRegistering(true);
      
      // Request permission and get FCM token
      const token = await requestNotificationPermission();
      
      if (token) {
        setFcmToken(token);
        setNotificationPermission('granted');
        
        // Register token with backend
        await api.post('/notifications/register-token', {
          fcmToken: token,
          deviceType: 'web'
        });
        
        console.log('FCM token registered with backend');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  /**
   * Subscribe to a notification topic
   * @param {string} topic - Topic name (e.g., 'match-123', 'tournament-456')
   */
  const subscribeToTopic = async (topic) => {
    try {
      await api.post('/notifications/subscribe', { topic });
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error('Error subscribing to topic:', error);
    }
  };

  /**
   * Unsubscribe from a notification topic
   * @param {string} topic - Topic name
   */
  const unsubscribeFromTopic = async (topic) => {
    try {
      await api.post('/notifications/unsubscribe', { topic });
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
    }
  };

  /**
   * Send test notification
   */
  const sendTestNotification = async () => {
    try {
      await api.post('/notifications/test');
      console.log('Test notification sent');
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  /**
   * Update notification preferences
   * @param {boolean} enabled - Enable/disable notifications
   */
  const updatePreferences = async (enabled) => {
    try {
      await api.put('/notifications/preferences', {
        notificationsEnabled: enabled
      });
      console.log('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  // Listen for foreground messages
  useEffect(() => {
    if (!fcmToken) return;

    const unsubscribe = onMessageListener();
    
    unsubscribe.then((payload) => {
      console.log('Foreground notification received:', payload);
      setLatestNotification(payload);
      
      // Show browser notification
      if (payload.notification && Notification.permission === 'granted') {
        const { title, body, icon } = payload.notification;
        new Notification(title, {
          body,
          icon: icon || '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          tag: payload.data?.type || 'general',
          data: payload.data
        });
      }
    }).catch(err => {
      console.error('Error listening for messages:', err);
    });

    return () => {
      // Cleanup if needed
    };
  }, [fcmToken]);

  return {
    notificationPermission,
    fcmToken,
    latestNotification,
    isRegistering,
    requestPermission,
    subscribeToTopic,
    unsubscribeFromTopic,
    sendTestNotification,
    updatePreferences
  };
};

export default useNotifications;
