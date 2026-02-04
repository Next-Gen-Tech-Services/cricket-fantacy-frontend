// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firebase Cloud Messaging
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
    console.log('✅ Firebase Messaging initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase Messaging initialization failed:', error);
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
      
      // Get FCM token without VAPID key first (will use default from Firebase)
      try {
        const token = await getToken(messaging);
        
        if (token) {
          console.log('FCM Token:', token);
          return token;
        } else {
          console.log('No registration token available');
          return null;
        }
      } catch (tokenError) {
        console.error('Error getting FCM token:', tokenError);
        
        // If token generation fails, try alternative approach
        console.log('Attempting to get token without service worker...');
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
export const onMessageListener = (callback) => {
  if (!messaging) {
    console.warn('Messaging not initialized');
    return () => {};
  }
  
  console.log('✅ Setting up FCM message listener...');
  
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('🔥 FCM Message received in foreground:', payload);
    console.log('📱 Notification details:', {
      title: payload.notification?.title,
      body: payload.notification?.body,
      data: payload.data
    });
    
    if (callback) {
      callback(payload);
    }
  });
  
  return unsubscribe;
};

export { app, analytics, messaging, auth, googleProvider };
