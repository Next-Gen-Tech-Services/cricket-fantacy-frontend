// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE2e9bDJAlSpnW95E2tfI1-8ck3UIQeDo",
  authDomain: "cricket-fantasy-743d8.firebaseapp.com",
  projectId: "cricket-fantasy-743d8",
  storageBucket: "cricket-fantasy-743d8.firebasestorage.app",
  messagingSenderId: "439087427201",
  appId: "1:439087427201:web:57bb12f2f19d28f8232780",
  measurementId: "G-7LYB3DBG3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase Cloud Messaging
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Firebase Messaging not supported:', error);
  }
}

// Request permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      throw new Error('Firebase Messaging not initialized');
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: 'BNwX0ZqCGJ0_XQz6fYz0jQnPjw8wYTJ3KxLZ-JYXGWiYcDj7X_1xYQGZQvL8tB5dHxTQYzQwXvL0jB9vXQz6fYz0' // TODO: Replace with actual VAPID key from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
      });
      
      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) {
      console.warn('Messaging not initialized');
      return;
    }
    
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      resolve(payload);
    });
  });
};

export { app, analytics, messaging };
